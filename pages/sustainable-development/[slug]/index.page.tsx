import Container from 'components/Container'
import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import s from '../eldikGreen.module.scss'
import { OtherPageApi } from 'services/api/OtherApi'
import { ISectionEldikGreenDeteil } from '../index.page'
import parse from 'html-react-parser'
import Document from 'components/Document'
interface Props {
  data: ISectionEldikGreenDeteil
}
const EldikGreenDeteil: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t("sustainable_development"),
            link: '/sustainable-development',
          }}
          slug={{
            title: data?.title,
            link: data?.slug || "",
          }}
        />
        <h1>{data?.title}</h1>
        <div className={s.eldikWrapper}>
          {parse(data?.description || data?.content || "")}
        </div>
        <div className={s.docs} style={{marginTop: 20}}>
          <Document documents={data?.documents}/>
        </div>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  locale,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getSustainableDetail(
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

export default EldikGreenDeteil
