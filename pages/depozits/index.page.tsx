import Accordion from 'components/Accordion'
import CardBig from 'components/Cards/CardBig'
import ContactBlock from 'components/ContactBlock'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { DepozitsApi } from 'services/api/DepozitsApi'
import { Depozits } from 'services/api/DepozitsApiModule'
import style from './depozits.module.scss'
import Heading from 'components/Heading/Heading'
import Container from 'components/Container'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useRouter } from 'next/router'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
interface DepozitsProps {
  data: Depozits
}
const DepozitsCom: NextPage<DepozitsProps> = ({ data }: DepozitsProps) => {
  const depozitsList = data?.deposits
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{data?.seo_title}</title>
        <meta name="description" content={data?.seo_description} key="description" />
        <meta name="keywords" content={data?.seo_keywords} key="keywords" />
        <meta property="og:title" content={data?.og_title || data?.seo_title} key="og:title" />
        <meta property="og:description" content={data?.og_description} key="og:description" />
        <link rel="canonical" href={getCanonicalUrl(router.locale || 'ru', '/depozits')} />
      </Head>
      <Container>
        <BreadCrumbsCustom
          absolute
          currentPage={{
            title: data.main_title,
            link: '/depozits',
          }}
        />
      </Container>
      <div className={style.page}>
        <br />
        <br />
        <Container>
          <Heading title={data?.main_title} />
        </Container>
        {depozitsList?.map((item) => (
          <CardBig
            key={item.id}
            img={item.image}
            desc={item.short_desc}
            title={item.name}
            is_available={item.is_available}
            shorts={item.shorts}
            linkBlue={`/depozits/${item?.slug}${router.query.for_who === 'legal' ? '?for_who=legal' : ''}`}
          />
        ))}
        <ContactBlock
          email={data.support_email}
          phone_number={data.support_phone}
        />
        {data?.faqs?.length >= 1 && <Accordion accardion={data.faqs} />}
      </div>
    </>
  )
}

export default DepozitsCom

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await DepozitsApi.getDepozits(locale || 'ru', typeOfUser)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
