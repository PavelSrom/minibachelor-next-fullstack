import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/client'

// https://stackoverflow.com/questions/66630456/how-can-i-built-a-hoc-for-guarding-routes-if-i-am-using-httponly-cookie

type CustomGetServerSidePropsContext = GetServerSidePropsContext & {
  session: Session
}

export const withAuth =
  <TProps = {}>(
    GetServerSidePropsFunction: (
      customCtx: CustomGetServerSidePropsContext
    ) => Promise<{ props: TProps & { session: Session } }>
  ) =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx)

    if (!session)
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }

    return await GetServerSidePropsFunction({ ...ctx, session })
  }
