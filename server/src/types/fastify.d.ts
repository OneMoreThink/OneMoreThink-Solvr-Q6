import { User } from '../db/schema'

declare module 'fastify' {
  interface FastifyRequest {
    user: User
  }
} 