import { Programme, School } from '.'

export type UserDTO = {
  id: number
  name: string
  surname: string
  email: string
  role: 'student' | 'teacher'
  school: School
  programme: Programme
}

export type QuestionDTO = {
  id: number
  userId: number
  User: {
    name: string
    surname: string
  }
  title: string
  description: string
  school: School
  programme: Programme
  createdAt: string
}

export type ProjectDTO = {
  id: number
  userId: number
  User: {
    name: string
    surname: string
  }
  school: School
  programme: Programme
  title: string
  description?: string
  demoUrl: string
  otherUrl?: string
  createdAt: string
}

export type CommentDTO = {
  id: number
  userId: number
  questionId?: number
  projectId?: number
  User: {
    name: string
    surname: string
  }
  text: string
  createdAt: string
}
