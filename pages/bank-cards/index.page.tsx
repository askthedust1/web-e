import Accordion from 'components/Accordion'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardBig from 'components/Cards/CardBig'
import ContactBlock from 'components/ContactBlock'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import NavigationDefault from 'components/Navigations/NavigationDefault'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import React, { useState } from 'react'
import { CardsApi } from 'services/api/CardsApi'
import { AllCards, BankCards, Cards } from 'services/api/CardsApModule'
import style from './bank-cards.module.scss'

interface BankCardsProps {
  data: Cards
  bankCard: BankCards
  allCards: AllCards
}

const BankCardsCom: NextPage<BankCardsProps> = ({
  bankCard,
  allCards,
}: BankCardsProps) => {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const router: any = useRouter()
  const currentCattegory = parseInt(router.query.category)
  const { t } = useTranslation()
  const onFilterCards = (category: number) => {
    const forWhoParam = router?.query.for_who === 'legal' ? '&for_who=legal' : ''

    if (currentCattegory === category) {
      router.push(`/bank-cards/?category=${''}${forWhoParam}`)
      return
    }
    if (currentCattegory !== category) {
      router.push(`/bank-cards/?category=${encodeURIComponent(category) || ''}${forWhoParam}`)
    }
  }

  const onFilterCardsMob = (category: string) => {
    const forWhoParam = router?.query.for_who === 'legal' ? '&for_who=legal' : ''
    setSelectedImage(category)
    router.push(`/bank-cards/?category=${encodeURIComponent(category) || ''}${forWhoParam}`)
  }
  return (
    <>
      <Head>
        <title>{bankCard?.seo_title}</title>
        <meta name="description" content={bankCard?.seo_description} key="description" />
        <meta name="keywords" content={bankCard?.seo_keywords} key="keywords" />
        <meta property="og:title" content={bankCard?.og_title || bankCard?.seo_title} key="og:title" />
        <meta property="og:description" content={bankCard?.og_description} key="og:description" />
        <meta property="og:image" content={bankCard?.og_image} key="og:image" />
        <link rel="canonical" href={getCanonicalUrl(router.locale || 'ru', '/bank-cards')} />
      </Head>
      <div className={style.page}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t('cards.bank_card_title'),
              link: '/bank-cards',
            }}
          />
        </Container>
        <Container>
          <HeadingWithNav title={t('cards.bank_card_title')} />
        </Container>

        <NavigationDefault
          data={bankCard.categories}
          onClick={onFilterCards}
          onFilterCardsMob={onFilterCardsMob}
          selectedImage={selectedImage}
        />
        {allCards?.results?.map((item) => (
          <CardBig
            key={item.id}
            title={item.name}
            desc={item.short_desc}
            img={item.image}
            is_available={item.is_available}
            is_creatable={item.is_creatable}
            linkBlue={`/bank-cards/${item?.slug}`}
            link={
              item.is_creatable
                ? {
                    pathname: '/bank-cards/order-card',
                    query: { ...router.query, type: item?.id },
                  }
                : null
            }
          />
        ))}

        {bankCard?.support_phone && (
          <ContactBlock
            phone_number={bankCard?.support_phone}
            email={bankCard.support_email}
          />
        )}
        {bankCard?.faqs && <Accordion accardion={bankCard?.faqs} />}
      </div>
    </>
  )
}

export default BankCardsCom

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const category = (query.category || '') as string
  const type = (query.type || 'bankovskie-karty') as string
  const { data } = await CardsApi.getAllCardsFilter(
    { category, type },
    locale || 'ru'
  )
  const response = await CardsApi.getBankCard(locale || 'ru')
  const bankCard = response.data
  return {
    props: {
      allCards: data,
      category,
      query,
      bankCard,
      ...(await getTranslations(locale as string)),
    },
  }
}
