import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/client'
import { IconButton, InputAdornment, Paper } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { useSnackbar } from 'notistack'
import { Formik, Form } from 'formik'
import { Text, TextField, Button } from '../styleguide'
import { LoginPayload } from '../types/payloads'
import { signinSchema } from '../utils/validations'
import { useEffect } from 'react'

const initialValues = {
  email: '',
  password: '',
}

const LoginPage: NextPage = () => {
  const router = useRouter()
  const [session] = useSession()
  const { enqueueSnackbar } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!!session) router.replace('/dashboard')
  }, [session])

  const handleSubmit = async (values: LoginPayload): Promise<void> => {
    setIsSubmitting(true)

    const result = await signIn('credentials', {
      redirect: false,
      ...values,
    })

    // the above promise always resolves, therefore this if-check
    if (!!result?.error) {
      enqueueSnackbar(result.error || 'Unable to sign in', {
        variant: 'error',
      })
      setIsSubmitting(false)
    } else {
      enqueueSnackbar('Signed in', { variant: 'success' })
    }
  }

  return (
    <section className="min-h-screen flex overflow-hidden">
      <div className="relative w-1/2 p-8 flex flex-col justify-center items-center">
        <Paper className="p-8 max-w-md z-10">
          <Text variant="h1" className="mb-2">
            Sign in to your account
          </Text>
          <Text className="mb-12">Stay in touch with your colleagues</Text>

          <Formik
            initialValues={initialValues}
            validationSchema={signinSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-8">
              <TextField name="email" label="Email" />
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

              <div>
                <Button fullWidth type="submit" color="primary" loading={isSubmitting}>
                  Sign in
                </Button>
                <Text variant="body2" className="mt-2">
                  Do not have an account?{' '}
                  <Link href="/register">
                    <a className="underline text-theme-primary">Sign up</a>
                  </Link>
                </Text>
              </div>
            </Form>
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
          <img src="/images/login.svg" alt="login.svg" className="max-w-full h-auto" />
          <Text className="text-2xl mt-6">
            Your colleagues are already there,
            <br /> sign in to connect with them
          </Text>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
