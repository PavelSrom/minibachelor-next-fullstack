import { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconButton, InputAdornment, MenuItem, Paper } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { useSnackbar } from 'notistack'
import { Formik, Form } from 'formik'
import { Text, TextField, Button } from '../styleguide'
import { RegisterPayload } from '../types/payloads'
import { schools } from '../utils/schools'
import { signupSchema } from '../utils/validations'
import { register } from '../requests'

const initialValues = {
  name: '',
  surname: '',
  email: '',
  password: '',
  role: 'student',
  school: '',
  programme: '',
}

const RegisterPage: NextPage = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values: RegisterPayload): Promise<void> => {
    setIsSubmitting(true)

    try {
      await register(values)

      router.push('/login')
      enqueueSnackbar('Successfully registered, please log in', {
        variant: 'success',
      })
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Unable to sign up', {
        variant: 'error',
      })
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen flex overflow-hidden">
      <div className="relative w-1/2 p-8 flex flex-col justify-center items-center">
        <Paper className="p-8 max-w-md z-10">
          <Text variant="h1" className="mb-2">
            Sign up to the platform
          </Text>
          <Text className="mb-12">
            Start collaborating with colleagues, discussing ideas, sharing projects and
            much more!
          </Text>

          <Formik
            initialValues={initialValues}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                  <TextField name="name" label="First name" />
                </div>
                <div className="col-span-6">
                  <TextField name="surname" label="Last name" />
                </div>
                <div className="col-span-12">
                  <TextField name="email" label="Email" />
                </div>
                <div className="col-span-12">
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="col-span-12">
                  <TextField name="role" label="Role" select>
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                  </TextField>
                </div>
                <div className="col-span-12">
                  <TextField
                    name="school"
                    label="School"
                    select
                    onAfterChange={() => setFieldValue('programme', '')}
                  >
                    {Object.keys(schools).map(school => (
                      <MenuItem key={school} value={school}>
                        {school}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="col-span-12">
                  <TextField
                    name="programme"
                    label="Study programme"
                    select={!!values.school}
                    disabled={!values.school}
                  >
                    {schools[values?.school]?.map((programme: string) => (
                      <MenuItem key={programme} value={programme}>
                        {programme}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="col-span-12">
                  <Button fullWidth type="submit" color="primary" loading={isSubmitting}>
                    Sign up
                  </Button>
                  <Text variant="body2" className="mt-2">
                    Already have an account?{' '}
                    <Link href="/login">
                      <a className="underline text-theme-primary">Sign in</a>
                    </Link>
                  </Text>
                </div>
              </Form>
            )}
          </Formik>
        </Paper>

        <img
          src="/images/login-decor.svg"
          alt="login-decor.svg"
          className="absolute -bottom-0.5 left-4"
        />
      </div>

      <div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center">
        <div className="max-w-xl">
          <img src="/images/register.svg" alt="login.svg" className="max-w-full h-auto" />
          <Text className="text-2xl mt-6">
            Our app helps you connect and share
            <br /> ideas and projects with your colleagues
          </Text>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
