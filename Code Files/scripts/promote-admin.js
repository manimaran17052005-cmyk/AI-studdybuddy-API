const mongoose = require("mongoose");
const User = require("../src/models/User");
const { normalizeMongoUri } = require("../src/utils/db");

const promoteAdmin = async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run promote-admin -- <email>");
    process.exitCode = 1;
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("Set MONGO_URI in .env before promoting an account.");
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(normalizeMongoUri(process.env.MONGO_URI), {
      serverSelectionTimeoutMS: 15000,
    });

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    ).select("email");

    if (!user) {
      console.error(`No account found for ${email}. Register it first.`);
      process.exitCode = 1;
      return;
    }

    console.log(`Promoted ${user.email} to admin. Sign in again to get a new access token.`);
  } finally {
    await mongoose.disconnect();
  }
};

promoteAdmin().catch((error) => {
  console.error(`Admin promotion failed (${error.name}${error.code ? `, ${error.code}` : ""}).`);
  process.exitCode = 1;
});