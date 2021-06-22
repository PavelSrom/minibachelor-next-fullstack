import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'DELETE':
      try {
        const projectToDelete = await prisma.project.findFirst({
          where: { id: +req.query.id },
        })
        if (!projectToDelete)
          return res.status(404).json({ message: 'Project not found' })
        // @ts-ignore
        if (projectToDelete.userId !== session.user.id)
          return res.status(403).json({ message: 'Access denied' })
        // does prisma cascade delete comments?
        await prisma.project.delete({ where: { id: projectToDelete.id } })

        return res.json({ message: 'Project removed' })
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
