import { NextApiRequest } from 'next'
import * as Yup from 'yup'

export const validateBody = async (
  schema: Yup.AnySchema,
  req: NextApiRequest
): Promise<{ isValid: boolean; message: any[] | null }> => {
  let isValid = false
  let message = null

  try {
    await schema.validate(req.body, { abortEarly: false })
    isValid = true
  } catch ({ errors }) {
    message = errors
  }

  return { isValid, message }
}

export const signupSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
  surname: Yup.string().required('This field is required'),
  email: Yup.string().email('Must be an email').required('This field is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .max(20, 'Max 20 characters')
    .required('This field is required'),
  role: Yup.string().oneOf(['student', 'teacher']).required('This field is required'),
  school: Yup.string().required('This field is required'),
  programme: Yup.string().required('This field is required'),
})

export const signinSchema = Yup.object().shape({
  email: Yup.string().email('Must be an email').required('This field is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .max(20, 'Max 20 characters')
    .required('This field is required'),
})

export const newQuestionSchema = Yup.object().shape({
  title: Yup.string().required('This field is required'),
  description: Yup.string().required('This field is required'),
  isPublic: Yup.boolean().required('This field is required'),
})

export const newProjectSchema = Yup.object().shape({
  title: Yup.string().required('This field is required'),
  description: Yup.string(),
  demoUrl: Yup.string().url('Must be a valid URL').required('This field is required'),
  otherUrl: Yup.string().url('Must be a valid URL'),
})

export const newCommentSchema = Yup.object().shape({
  text: Yup.string().required('This field is required'),
})
