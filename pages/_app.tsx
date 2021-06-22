import React from 'react'
import '../styles/globals.css'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, StylesProvider } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import { muiTheme } from '../utils/theme'
import { WithLayout } from '../hoc/with-layout'
import { CustomAppProps } from '../types/next'
import { AuthProvider } from '../contexts/auth'
import { queryClient } from '../utils/query-client'

function MyApp({ Component, pageProps }: CustomAppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <NextAuthProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={muiTheme}>
          <StylesProvider injectFirst>
            <SnackbarProvider
              dense
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <AuthProvider>
                {Component.withLayout ? (
                  <WithLayout>
                    <Component {...pageProps} />
                  </WithLayout>
                ) : (
                  <Component {...pageProps} />
                )}
              </AuthProvider>
            </SnackbarProvider>
          </StylesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NextAuthProvider>
  )
}

export default MyApp
