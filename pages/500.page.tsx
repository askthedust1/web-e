import Error505 from 'components/Error505'
import type { NextPage } from 'next'

const Custom500Page: NextPage = () => {
  return <Error505 statusCode={500} />
}

export default Custom500Page
