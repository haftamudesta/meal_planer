import { PrismaClient } from '@/app/generated/prisma/client'
import type { Prisma } from '@/app/generated/prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaOptions)
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaOptions)
  }
  prisma = global.prisma
}

export { prisma }