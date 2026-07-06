import Error505 from 'components/Error505'
import type { NextPage, NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

interface ErrorPageProps {
  statusCode: number
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  if (statusCode === 404) {
    return <NextErrorComponent statusCode={404} />
  }

  return <Error505 statusCode={statusCode || 500} />
}

ErrorPage.getInitialProps = async (context: NextPageContext) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context)

  return {
    statusCode: errorInitialProps.statusCode || 500,
  }
}

export default ErrorPage
