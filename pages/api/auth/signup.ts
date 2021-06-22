import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../prisma'
import { validateBody, signupSchema } from '../../../utils/validations'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const { isValid, message } = await validateBody(signupSchema, req)
      if (!isValid) return res.status(400).json({ message })

      const { name, surname, email, password, role, school, programme } = req.body

      try {
        const userExists = await prisma.user.findFirst({ where: { email } })
        if (userExists) return res.status(400).json({ message: 'User already exists' })

        await prisma.user.create({
          data: {
            name,
            surname,
            email,
            password: await bcrypt.hash(password, 8),
            role,
            school,
            programme,
          },
        })

        return res.status(201).json({ message: 'User created' })
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
