/**
 * predev.js — runs before `npm run dev`
 * Seeds the local SQLite DB, then exits with code 0 so Next.js dev server starts.
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.join(__dirname, "..");
const envLocalPath = path.join(rootDir, ".env.local");

// Load .env.local
const env = { ...process.env };
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).replace(/^["']|["']$/g, "").trim();
    if (!env[key]) env[key] = val;
  }
}

// seed.js fallback DATABASE_URL for local SQLite
if (!env.DATABASE_URL) {
  env.DATABASE_URL = "file:../database/database.db";
}

const seedPath = path.join(rootDir, "prisma", "seed.js");

const child = spawn(process.execPath, [seedPath], {
  cwd: path.join(rootDir, "prisma"),
  env,
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exitCode = code === 0 ? 0 : 1;
});

child.on("error", (err) => {
  console.error("[predev] Failed to start seed:", err.message);
  process.exitCode = 1;
});
