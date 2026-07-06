import Container from 'components/Container'
import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import { OtherPageApi } from 'services/api/OtherApi'
import parse from 'html-react-parser'
import { ISectionEldikGreenDeteil } from 'pages/sustainable-development/index.page'
import s from './news.module.scss'
import AppImage from 'components/ui/AppImage'
import { useMediaQuery } from 'react-responsive'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'

interface Props {
  data: ISectionEldikGreenDeteil
}
const StoriesDetail: NextPage<Props> = ({ data }) => {
  const { t: _t } = useTranslation()
  const isMobile = useMediaQuery({ maxWidth: 640 })

  return (
    <div className={s.wrapper}>
      <VacanciesNav />
      <Container>
        <h2 className={s.title}>{data?.title}</h2>
        <div
          style={{
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AppImage
            alt={data?.slug || ''}
            src={data?.image || '/'}
            className={s.imgWrapper}
            height={!isMobile ? 600 : 250}
            width={!isMobile ? 1200 : 380}
          />
        </div>
        <div className={s.textWrapper}>
          {parse(data?.description || data?.content || '')}
        </div>
      </Container>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  locale,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getHrStuffDetail(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}

export default StoriesDetail
