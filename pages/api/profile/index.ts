import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      try {
        const userProfile = await prisma.user.findFirst({
          // @ts-ignore
          where: { id: session.user!.id },
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            role: true,
            school: true,
            programme: true,
          },
        })
        if (!userProfile) return res.status(404).json({ message: 'User not found' })

        return res.json(userProfile)
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    case 'DELETE':
      try {
        const userToDelete = await prisma.user.delete({
          // @ts-ignore
          where: { id: session.user!.id },
        })
        if (!userToDelete) return res.status(404).json({ message: 'User not found' })
        // does prisma cascade delete? if not, then delete everything here
        return res.json({ message: 'User deleted' })
      } catch ({ message }) {
        return res.status(500).send({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
