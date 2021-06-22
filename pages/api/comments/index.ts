import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { getSession } from 'next-auth/client'
import { prisma } from '../../../prisma'
import { newCommentSchema, validateBody } from '../../../utils/validations'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      const { questionId, projectId } = req.query
      if (questionId && projectId)
        return res.status(400).json({ message: 'Invalid request' })

      const where: Prisma.CommentWhereInput = {}
      if (questionId) where.questionId = +questionId
      if (projectId) where.projectId = +projectId

      try {
        const allComments = await prisma.comment.findMany({
          where,
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            userId: true,
            User: { select: { name: true, surname: true } },
            questionId: true,
            projectId: true,
            text: true,
            createdAt: true,
          },
        })

        return res.json(allComments)
      } catch ({ message }) {
        console.log(message)
        return res.status(500).json({ message })
      }

    case 'POST':
      const { isValid, message } = await validateBody(newCommentSchema, req)
      if (!isValid) return res.status(400).json({ message })

      if (req.body.questionId && req.body.projectId)
        return res.status(400).json({ message: 'Invalid request' })

      const data: Prisma.CommentCreateInput = {
        // @ts-ignore
        User: { connect: { id: session.user.id } },
        text: req.body.text,
      }
      if (req.body.questionId) data.Question = { connect: { id: +req.body.questionId } }
      if (req.body.projectId) data.Project = { connect: { id: +req.body.projectId } }

      try {
        const newComment = await prisma.comment.create({
          data,
          select: {
            id: true,
            userId: true,
            User: { select: { name: true, surname: true } },
            questionId: true,
            projectId: true,
            text: true,
            createdAt: true,
          },
        })

        return res.status(201).json(newComment)
      } catch ({ message }) {
        console.log(message)
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
