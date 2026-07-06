import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import parse from 'html-react-parser'
import Container from 'components/Container'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Document from 'components/Document'
import InvestorContacts from 'components/InvestorContacts'
import { getTranslations } from 'helpers/serverTranslations'
import { InvestorRelationsApi } from 'services/api/InvestorRelationsApi'
import { InvestorSectionDetail } from 'services/api/InvestorRelationsApi.models'

interface Props {
  data: InvestorSectionDetail
}

const InvestorRelationsDetail: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <BreadCrumbsCustom
        currentPage={{
          title: t('investor_relations'),
          link: '/investor-relations',
        }}
        slug={{
          title: data?.title,
          link: data?.slug || '',
        }}
      />
      <h1>{data?.title}</h1>
      {data?.kind === 'contacts' ? (
        <InvestorContacts contacts={data?.contacts} />
      ) : (
        <>
          <div>{parse(data?.description || '')}</div>
          <div style={{ marginTop: 20 }}>
            <Document documents={data?.documents} />
          </div>
        </>
      )}
    </Container>
  )
}

export default InvestorRelationsDetail

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  locale,
}) => {
  const { data } = await InvestorRelationsApi.getInvestorRelationsDetail(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
