import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { checkQueryParams } from '../../helpers/changeTypeOfUse'
import { getTranslations } from 'helpers/serverTranslations'
import { LeasingApi } from 'services/api/LeasingApi'
import { useRouter } from 'next/router'
import Container from 'components/Container'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import style from 'pages/credits/credits.module.scss'
import Heading from 'components/Heading/Heading'
import CardBig from 'components/Cards/CardBig'
import { LeasingList } from 'services/api/LeasingModule'


interface LeasingPageProps {
  data: LeasingList
}
const LeasingPage: NextPage<LeasingPageProps> = ({
                                             data,
                                           }: LeasingPageProps) => {
  const router = useRouter()

  return (
    <>
      <div className={style.page}>
        <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: 'Лизинг',
            link: '/leasing',
          }}
        />
      </Container>
        <Container>
          <Heading title={"Лизинг"} />
        </Container>


        {data?.results?.map((item) => (
          <CardBig
            img={item.image}
            title={item.name}
            desc={item.short_desc}
            key={item.id}
            linkBlue={`/leasing/${item?.slug}${router.query.for_who === 'legal' ? '?for_who=legal' : ''}`}
          />
        ))}
      </div>
    </>
  )
}

export default LeasingPage

export const getServerSideProps: GetServerSideProps = async ({
                                                               locale,
                                                               query,
                                                             }) => {
  const { data } = await LeasingApi.getLeasing(locale || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}