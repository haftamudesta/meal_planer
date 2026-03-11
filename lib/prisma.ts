import { PrismaClient } from '@/app/generated/prisma/client'
import type { Prisma } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var prisma: PrismaClient | undefined
  var pool: Pool | undefined
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool) 

const prismaOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
  adapter, 
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