import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'
import { newProjectSchema, validateBody } from '../../../utils/validations'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      const { user, school, programme, sortBy } = req.query

      const where: Prisma.ProjectWhereInput = {}
      const orderBy: Prisma.ProjectOrderByInput = {}

      if (user) where.userId = +user
      if (school) where.school = school as string
      if (programme) where.programme = programme as string
      if (sortBy) orderBy.createdAt = sortBy === 'newest' ? 'desc' : 'asc'

      try {
        const projects = await prisma.project.findMany({
          where,
          orderBy,
          select: {
            id: true,
            userId: true,
            User: { select: { name: true, surname: true } },
            school: true,
            programme: true,
            title: true,
            description: true,
            demoUrl: true,
            otherUrl: true,
          },
        })

        return res.json(projects)
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    case 'POST':
      const { isValid, message } = await validateBody(newProjectSchema, req)
      if (!isValid) return res.status(400).json({ message })

      const { title, description, demoUrl, otherUrl } = req.body

      try {
        // @ts-ignore
        const user = await prisma.user.findFirst({ where: { id: session.user.id } })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const newProject = await prisma.project.create({
          data: {
            User: { connect: { id: user.id } },
            school: user.school,
            programme: user.programme,
            title,
            description,
            demoUrl,
            otherUrl,
          },
          select: {
            id: true,
            userId: true,
            User: { select: { name: true, surname: true } },
            school: true,
            programme: true,
            title: true,
            description: true,
            demoUrl: true,
            otherUrl: true,
            createdAt: true,
          },
        })

        return res.status(201).json(newProject)
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
