import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function getPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient()
    }
    return globalForPrisma.prisma
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }

  return globalForPrisma.prisma
}

const prisma = new Proxy({}, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = client[prop]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

export default prisma
