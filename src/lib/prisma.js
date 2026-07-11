import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

let _prisma = null;

function getEnv(key, fallback = "") {
  const val = process.env[key] || fallback;
  return String(val).replace(/^["']|["']$/g, "").trim();
}

function createPrismaClient() {
  const tursoUrl = getEnv("TURSO_DATABASE_URL", "");
  const isTurso = tursoUrl.startsWith("libsql://");

  if (isTurso) {
    const token = getEnv("TURSO_AUTH_TOKEN", "");
    if (!token) {
      throw new Error("TURSO_AUTH_TOKEN is not set in .env.local");
    }

    const originalFetch = globalThis.fetch.bind(globalThis);
    const noCacheFetch = (url, init = {}) => {
      const isTursoReq = typeof url === "string" && url.includes("database-hiendat204");
      if (isTursoReq) {
        return originalFetch(url, { ...init, cache: "no-store", next: { revalidate: 0 } });
      }
      return originalFetch(url, init);
    };

    const libsql = createClient({ url: tursoUrl, authToken: token, fetch: noCacheFetch });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  throw new Error(
    "TURSO_DATABASE_URL must be set to a libsql:// URL in .env.local"
  );
}

function getPrisma() {
  if (!_prisma) {
    _prisma = createPrismaClient();
  }
  return _prisma;
}

// Proxy — all property accesses and method calls are forwarded to the real
// PrismaClient, which is only created on the very first actual DB access.
// This keeps the server from crashing at module-import time.
const prisma = new Proxy({}, {
  get(_, prop) {
    const client = getPrisma();
    return client[prop];
  },
  has(_, prop) {
    return prop in getPrisma();
  },
});

export default prisma;
export { getPrisma };
