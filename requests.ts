import axios from 'axios'
import queryString from 'query-string'
import { CommentFilters, ProjectFilters, QuestionFilters, UserFilters } from './types'
import { CommentDTO, ProjectDTO, QuestionDTO, UserDTO } from './types/api'
import {
  NewCommentPayload,
  NewProjectPayload,
  NewQuestionPayload,
  RegisterPayload,
} from './types/payloads'

/**
 * AUTH
 */

// implemented
export const register = (formData: RegisterPayload): Promise<{ message: string }> =>
  axios.post('/api/auth/signup', formData).then(({ data }) => data)

// implemented
export const getUserProfile = (): Promise<UserDTO> =>
  axios.get('/api/profile').then(({ data }) => data)

export const deleteUser = (): Promise<unknown> =>
  axios.delete('/api/profile').then(({ data }) => data)

/**
 * QUESTIONS
 */

// implemented
export const getQuestions = (filters: QuestionFilters): Promise<QuestionDTO[]> => {
  const query = queryString.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  })

  return axios.get(`/api/questions?${query}`).then(({ data }) => data)
}

// implemented
export const postQuestion = (formData: NewQuestionPayload): Promise<QuestionDTO> =>
  axios.post(`/api/questions`, formData).then(({ data }) => data)

// implemented
export const deleteQuestion = (id: number): Promise<unknown> =>
  axios.delete(`/api/questions/${id}`).then(({ data }) => data)

/**
 * PROJECTS
 */

export const getProjects = (filters: ProjectFilters): Promise<ProjectDTO[]> => {
  const query = queryString.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  })

  return axios.get(`/api/projects?${query}`).then(({ data }) => data)
}

export const uploadProject = (formData: NewProjectPayload): Promise<ProjectDTO> =>
  axios.post(`/api/projects`, formData).then(({ data }) => data)

export const deleteProject = (id: number): Promise<unknown> =>
  axios.delete(`/api/projects/${id}`).then(({ data }) => data)

/**
 * COLLEAGUES
 */

export const getColleagues = (filters: UserFilters): Promise<UserDTO[]> => {
  const query = queryString.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  })

  return axios.get(`/api/accounts?${query}`).then(({ data }) => data)
}

export const getColleagueDetail = (id: number): Promise<UserDTO> =>
  axios.get(`/api/accounts/${id}`).then(({ data }) => data)

/**
 * COMMENTS
 */

export const getComments = (filters: CommentFilters): Promise<CommentDTO[]> => {
  const query = queryString.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  })

  return axios.get(`/api/comments?${query}`).then(({ data }) => data)
}

export const postComment = ({
  filters,
  formData,
}: {
  filters: CommentFilters
  formData: NewCommentPayload
}): Promise<CommentDTO> => {
  const bodyToSend: any = { ...formData }
  if (filters.questionId) bodyToSend.questionId = filters.questionId
  if (filters.projectId) bodyToSend.projectId = filters.projectId

  return axios.post(`/api/comments`, bodyToSend).then(({ data }) => data)
}

export const deleteComment = (commentId: number): Promise<unknown> =>
  axios.delete(`/api/comments/${commentId}`).then(({ data }) => data)
