import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import parse from 'html-react-parser'
import Container from 'components/Container'
import Heading from 'components/Heading/Heading'
import CardBig from 'components/Cards/CardBig'
import notPhoto from 'public/images/no-photo.jpg'
import { getTranslations } from 'helpers/serverTranslations'
import { InvestorRelationsApi } from 'services/api/InvestorRelationsApi'
import { InvestorPage } from 'services/api/InvestorRelationsApi.models'

interface Props {
  data: InvestorPage[]
}

const InvestorRelations: NextPage<Props> = ({ data }) => {
  const page = data?.[0]

  if (!page) {
    return null
  }

  return (
    <div>
      <br />
      <br />
      <Container>
        <Heading title={page.main_title} />
        {parse(page.main_desc || '')}
      </Container>
      <Container>
        <div style={{ marginTop: 20 }}>
          {page.sections?.map((item) => (
            <CardBig
              key={item.id}
              img={item.icon || notPhoto}
              title={item.title}
              linkBlue={`/investor-relations/${item.slug}`}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default InvestorRelations

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await InvestorRelationsApi.getInvestorRelations(
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
