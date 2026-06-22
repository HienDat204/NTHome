import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const databaseUrl =
    process.env.DATABASE_URL || "file:../database/database.db";
  const isTurso = databaseUrl.startsWith("libsql://");

  if (isTurso) {
    // Turso with libSQL adapter
    if (!process.env.TURSO_AUTH_TOKEN) {
      console.error("TURSO_AUTH_TOKEN is not set");
      throw new Error("TURSO_AUTH_TOKEN is required for Turso connection");
    }

    const libsql = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSQL(libsql);

    return new PrismaClient({ adapter });
  } else {
    // Local SQLite
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
