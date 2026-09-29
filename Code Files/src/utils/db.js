const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

let memoryServer;

const normalizeMongoUri = (uri) => {
  if (!uri) return uri;

  if (uri.startsWith("http://mongodb+srv://")) {
    uri = uri.slice("https://".length);
  } else if (uri.startsWith("https://") && uri.includes(".mongodb.net")) {
    uri = `mongodb+srv://${uri.slice("https://".length)}`;
  }

  const queryIndex = uri.indexOf("?");
  if (queryIndex !== -1) {
    const prefix = uri.slice(0, queryIndex);
    let query = uri.slice(queryIndex + 1);

    query = query.replace(/^\s*(?:ai\s*studybuddy\s*(?:api)?)\s*/i, "");
    query = query.replace(/\s+/g, "");

    if (query) {
      uri = `${prefix}?${query}`;
    }
  }

  const credentialsStart = uri.indexOf("://") + 3;
  const credentialsEnd = uri.lastIndexOf("@");
  if (credentialsStart < 3 || credentialsEnd < credentialsStart) return uri;

  const credentials = uri.slice(credentialsStart, credentialsEnd);
  const passwordStart = credentials.indexOf(":");
  if (passwordStart < 0) return uri;

  const encodeCredential = (value) => value
    .replace(/%(?![0-9a-f]{2})/gi, "%25")
    .replace(/[:/?#[\]@]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  const username = encodeCredential(credentials.slice(0, passwordStart));
  const password = encodeCredential(credentials.slice(passwordStart + 1));

  return `${uri.slice(0, credentialsStart)}${username}:${password}${uri.slice(credentialsEnd)}`;
};

const connectDB = async () => {
  let mongoUri = normalizeMongoUri(process.env.MONGO_URI);

  if (!mongoUri) {
    memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    process.env.MONGO_URI = mongoUri;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const safeMessage = error.message.replace(
      /(mongodb(?:\+srv)?:\/\/)[^@\s]+@/gi,
      "$1[redacted]@"
    );
    console.warn(`MongoDB connection failed (${error.name}): ${safeMessage}`);

    if (!memoryServer && process.env.NODE_ENV !== "production") {
      console.warn("MongoDB connection failed, starting in-memory fallback...");
      memoryServer = await MongoMemoryServer.create();
      const fallbackUri = memoryServer.getUri();
      process.env.MONGO_URI = fallbackUri;
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`MongoDB connected via in-memory server: ${conn.connection.host}`);
      return conn;
    }

    throw error;
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
};

module.exports = { connectDB, closeDB, normalizeMongoUri };
