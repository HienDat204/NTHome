import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis;

function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || "file:../database/database.db";

  // Check if using Turso (libSQL)
  const isTurso = databaseUrl.startsWith("libsql://");

  let options;

  if (isTurso) {
    // Turso configuration with libSQL adapter
    if (!process.env.TURSO_AUTH_TOKEN) {
      console.error("TURSO_AUTH_TOKEN is not set");
      throw new Error("TURSO_AUTH_TOKEN is required for Turso connection");
    }

    const libsql = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const adapter = new PrismaLibSql(libsql);

    options = {
      adapter,
    };
  } else {
    // Local SQLite configuration
    options = {
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    };
  }

  if (process.env.NODE_ENV === "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient(options);
    }
    return globalForPrisma.prisma;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient(options);
  }

  return globalForPrisma.prisma;
}

const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaClient();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  },
);

export default prisma;
