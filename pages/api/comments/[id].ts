import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'DELETE':
      try {
        const commentToDelete = await prisma.comment.findFirst({
          where: { id: +req.query.id },
        })
        if (!commentToDelete)
          return res.status(404).json({ message: 'Comment not found' })
        // @ts-ignore
        if (commentToDelete.userId !== session.user.id)
          return res.status(403).json({ message: 'Access denied' })

        await prisma.comment.delete({ where: { id: +req.query.id } })

        return res.json({ message: 'Comment deleted' })
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
