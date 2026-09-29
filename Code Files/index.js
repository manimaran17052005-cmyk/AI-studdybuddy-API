require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const { connectDB, closeDB } = require("./src/utils/db");
const fs = require("fs");

const requiredEnv = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "GEMINI_API_KEY"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

if (!process.env.MONGO_URI || /aistudybuddy|ai\s*studybuddy/i.test(process.env.MONGO_URI)) {
  process.env.MONGO_URI = "mongodb+srv://Maran:Maran1721@cluster0.ttfl7iy.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority";
}

const app = express();

if(!fs.existsSync("uploads")) fs.mkdirSync("uploads");
// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5000" }));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/materials", require("./src/routes/materials"));
app.use("/api/admin", require("./src/routes/admin"));

// Health check
app.get("/", (req, res) => res.json({ message: "AI StudyBuddy API is running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File must be 5 MB or smaller" });
  }
  const status = err.status || 500;
  const message = status >= 500 && process.env.NODE_ENV === "production"
    ? "Something went wrong"
    : err.message || "Something went wrong";
  res.status(status).json({ message });
});

const basePort = Number(process.env.PORT || 5001);
let PORT = basePort;
let server;

const shutdown = async (signal) => {
  if (server?.listening) {
    await new Promise((resolve) => server.close(resolve));
  }
  await closeDB();
  if (signal === "SIGUSR2") {
    process.kill(process.pid, signal);
  } else {
    process.exit(0);
  }
};

const startServer = (port) => new Promise((resolve, reject) => {
  const appServer = app.listen(port, () => {
    server = appServer;
    PORT = port;
    console.log(`Server running on port ${PORT}`);
    resolve(appServer);
  });

  appServer.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port === basePort) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${nextPort}...`);
      PORT = nextPort;
      startServer(nextPort).then(resolve).catch(reject);
      return;
    }

    const message = error.code === "EADDRINUSE"
      ? `Port ${port} is already in use`
      : "Unable to start server";
    console.error(`${message} (${error.code || error.name}).`);
    closeDB().finally(() => reject(error));
  });
});

["SIGINT", "SIGTERM", "SIGUSR2"].forEach((signal) => {
  process.once(signal, () => {
    shutdown(signal).catch(() => process.exit(1));
  });
});

connectDB()
  .then(() => startServer(PORT))
  .catch(async (error) => {
    console.error(`Database connection failed (${error.name}).`);
    await closeDB();
    process.exitCode = 1;
  });
