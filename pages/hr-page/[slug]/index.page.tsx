import Container from 'components/Container'
import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import { OtherPageApi } from 'services/api/OtherApi'
import parse from 'html-react-parser'
import { ISectionEldikGreenDeteil } from 'pages/sustainable-development/index.page'
import s from 'pages/news/news.module.scss'
import AppImage from 'components/ui/AppImage'
import { useMediaQuery } from 'react-responsive'

interface Props {
  data: ISectionEldikGreenDeteil
}
const HrStuffDetail: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery({ maxWidth: 640 })

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('info_page.vacancies'),
            link: '/info?page=1&type=vacancies',
          }}
          slug={{
            title: data?.title,
            link: data?.slug || '',
          }}
        />
        <h1>{data?.title}</h1>
        <div style={{ marginBottom: 20 }}>
          <AppImage
            alt={data?.title}
            src={data?.image || '/'}
            className={s.imgWrapper}
            height={!isMobile ? 460 : 250}
            width={!isMobile ? 1000 : 380}
            sizes="(max-width: 640px) 100vw, 1000px"
          />
        </div>
        <div>{parse(data?.description || data?.content || '')}</div>
      </Container>
    </>
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

export default HrStuffDetail
