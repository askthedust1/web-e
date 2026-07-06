import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import Container from 'components/Container'
import SurveyForm from 'components/Survey'
import { SurveyApi } from 'services/api/SurveyApi'
import { SurveyData } from 'services/api/SurveyApi.models'

interface Props {
  survey: SurveyData
}

const SurveyPage: NextPage<Props> = ({ survey }) => {
  const { t } = useTranslation('common')

  if (!survey) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1>{t('survey.notFound')}</h1>
        </div>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>{survey.title}</title>
        <meta name="description" content={survey.description} />
      </Head>
      <Container>
        <SurveyForm survey={survey} />
      </Container>
    </>
  )
}

export default SurveyPage

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, locale }) => {
  const slug = params?.slug as string
  const { data } = await SurveyApi.getSurvey(slug, locale || 'ru')

  return {
    props: {
      survey: data,
      ...(await getTranslations(locale as string)),
    },
  }
}
