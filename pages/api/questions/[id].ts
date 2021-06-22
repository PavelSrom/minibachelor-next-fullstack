import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'DELETE':
      try {
        const questionToDelete = await prisma.question.findFirst({
          where: { id: +req.query.id },
        })
        if (!questionToDelete)
          return res.status(404).json({ message: 'Question not found' })
        // @ts-ignore
        if (questionToDelete.userId !== session.user.id)
          return res.status(403).json({ message: 'Access denied' })
        // does prisma cascade delete comments?
        await prisma.question.delete({
          where: { id: questionToDelete.id },
          include: { Comment: true },
        })

        return res.json({ message: 'Question removed' })
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
