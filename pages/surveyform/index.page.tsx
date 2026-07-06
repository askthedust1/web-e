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
  survey: SurveyData | null
}

const DEFAULT_SURVEY_SLUG = 'support-quality-tech'

const SurveyFormPage: NextPage<Props> = ({ survey }) => {
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

export default SurveyFormPage

export const getServerSideProps: GetServerSideProps<Props> = async ({ locale, query }) => {
  const slug = typeof query.slug === 'string' ? query.slug : DEFAULT_SURVEY_SLUG

  try {
    const { data } = await SurveyApi.getSurvey(slug, locale || 'ru')

    return {
      props: {
        survey: data,
        ...(await getTranslations(locale as string)),
      },
    }
  } catch {
    return {
      props: {
        survey: null,
        ...(await getTranslations(locale as string)),
      },
    }
  }
}
