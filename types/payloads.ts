export type RegisterPayload = {
  name: string
  surname: string
  email: string
  password: string
  role: string
  school: string
  programme: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type NewQuestionPayload = {
  title: string
  description: string
  isPublic: boolean
}

export type NewProjectPayload = {
  title: string
  description?: string
  demoUrl: string
  otherUrl?: string
}

export type NewCommentPayload = {
  text: string
}
