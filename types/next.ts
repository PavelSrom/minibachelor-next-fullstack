import { NextComponentType, NextPage, NextPageContext } from 'next'
import { AppProps } from 'next/app'

export type CustomAppProps<P = {}> = Omit<AppProps, 'Component'> & {
  Component: NextComponentType<NextPageContext, any, P> & {
    withLayout?: boolean
  }
}

type PageOptions = {
  withLayout?: boolean
}

export type CustomNextPage = NextPage & PageOptions
