import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) return res.status(403).json({ message: 'Access denied' })

  return res.status(200).json({ name: 'John Doe' })
}
