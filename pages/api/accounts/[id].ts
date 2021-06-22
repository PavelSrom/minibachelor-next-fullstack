import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      try {
        const userToView = await prisma.user.findFirst({
          where: { id: +req.query.id },
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

        return res.json(userToView)
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
