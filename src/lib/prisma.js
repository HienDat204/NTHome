import { createRequire } from "module";

const globalForPrisma = globalThis;
const require = createRequire(import.meta.url);

let PrismaClientCtor;

function getPrismaClientCtor() {
  if (!PrismaClientCtor) {
    const { PrismaClient } = require("@prisma/client");
    PrismaClientCtor = PrismaClient;
  }

  return PrismaClientCtor;
}

function getPrismaClient() {
  const PrismaClient = getPrismaClientCtor();

  if (process.env.NODE_ENV === "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
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
