import CardLongDoc from 'components/Cards/CardLongDoc'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import React from 'react'
import { useTranslation } from 'next-i18next'
import Section from 'components/Section'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import s from './public-offer.module.scss'
import { PublicOfferApi } from 'services/api/PublicOfferApi'
import { PublicOffersApiProps } from 'services/api/PublicOfferApiModule'
interface Props {
  data: PublicOffersApiProps[]
}

const PublicOffer: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()


  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('setting.public-offer'),
            link: '/transfers',
          }}
        />
      </Container>
      <Container>
        <Section className={s.wrapper}>
          <HeadingWithNav title={t('setting.public-offer')} />
        </Section>
        {data?.map((item) => (
          <CardLongDoc
            key={item.id}
            data={item}
            value={t('setting.download')}
          />
        ))}
      </Container>
    </>
  )
}

export default PublicOffer

export const getServerSideProps: GetServerSideProps = async ({
                                                               locale,
                                                               query,
                                                             }) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await PublicOfferApi.getPublicOffer(locale as string, {
    ...typeOfUser,
  })
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
