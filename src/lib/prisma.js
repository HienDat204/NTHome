import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

let prismaInstance = null

function createPrismaClient() {
  const databaseUrl =
    process.env.DATABASE_URL || "file:../prisma/dev.db";
  const isTurso = databaseUrl.startsWith("libsql://");

  if (isTurso) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      throw new Error("TURSO_AUTH_TOKEN is required for Turso connection");
    }

    const originalFetch = globalThis.fetch.bind(globalThis);
    const noCacheFetch = (url, init = {}) => {
      const isTursoReq = typeof url === 'string' && url.includes('database-hiendat204');
      if (isTursoReq) {
        return originalFetch(url, {
          ...init,
          cache: 'no-store',
          next: { revalidate: 0 },
        });
      }
      return originalFetch(url, init);
    };

    const libsql = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
      fetch: noCacheFetch,
    });

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  } else {
    return new PrismaClient({
      datasources: { db: { url: databaseUrl } },
      log: process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    });
  }
}

// Create a fresh instance per request — prevents stale Prisma client
// issues on Next.js hot-module-replacement in development
export function getPrisma() {
  return createPrismaClient()
}

const prisma = createPrismaClient()
export default prisma

