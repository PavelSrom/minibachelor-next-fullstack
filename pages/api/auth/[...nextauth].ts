import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../prisma'

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials: { email: string; password: string }) {
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        })
        if (!user) throw new Error('Invalid credentials')

        const match = await bcrypt.compare(credentials.password, user.password)
        if (!match) throw new Error('Invalid credentials')

        return { id: user.id }
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      if (user?.id) token.id = user.id

      return token
    },
    session: async (session, user) => {
      session.user = user

      return Promise.resolve(session)
    },
  },
})
