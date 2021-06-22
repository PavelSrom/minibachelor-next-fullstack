import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      const { role } = req.query
      if (!role)
        return res
          .status(400)
          .send({ message: `Bad request - missing query param 'role'` })

      try {
        // @ts-ignore
        const user = await prisma.user.findFirst({ where: { id: session.user.id } })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const colleagues = await prisma.user.findMany({
          where: { role: role as string, school: user.school, programme: user.programme },
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

        return res.json(colleagues)
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
