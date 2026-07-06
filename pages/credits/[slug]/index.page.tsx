import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Calculator from 'components/Calculator'
import CardText from 'components/Cards/CardText'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardNumber from 'components/Grids/GridCardNumber'
import GridCardThin from 'components/Grids/GridCardThin'
import HeadingWithNav from 'components/Heading/Heading'
import Section from 'components/Section'
import TabDefault from 'components/Tab'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import React from 'react'
import Head from 'next/head'
import { CreditsApi, CreditOrderApi } from 'services/api/CreditsApi'
import { CreditsTypeOne } from 'services/api/CreditsApiModule'
import style from 'components/Banner/banner.module.scss'
import Button from 'components/Buttons/Button'

interface CreditsProps {
  data: CreditsTypeOne
  isApplicationEnabled: boolean
}

const Credits: NextPage<CreditsProps> = ({
  data,
  isApplicationEnabled,
}: CreditsProps) => {
  const { t } = useTranslation()
  const Router = useRouter()
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: data?.banner_title,
    description: data?.banner_subtitle,
    provider: {
      '@type': 'BankOrCreditUnion',
      name: 'Элдик Банк',
      url: 'https://eldik.kg',
    },
    url: `https://eldik.kg/credits/${Router?.query?.slug}`,
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>
      <div style={{ overflow: 'hidden' }}>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ''}
            absolute
            currentPage={{
              title: t('pages_names.all_credits'),
              link: '/credits',
            }}
            slug={{
              title: data?.banner_title,
              link: data?.slug,
            }}
          />
        </Container>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ''}
            banner_subtitle_hex={data?.banner_subtitle_hex || ''}
            isReques={true}
            // linkObj={{
            //   pathname: Router?.query?.slug?.includes("nakopitelnaya-ipoteka-gik") ? "/online-service/savings-mortgage" : `/credits/order-credit`,
            //   query: {
            //     for_who: Router?.query?.for_who || 'individual',
            //     type: String(data?.id),
            //   },
            // }}
            link={data?.banner_button_link}
            title={data?.banner_title}
            subtitle={data?.banner_subtitle}
            linkText={data?.banner_button_text}
            imagePath={data?.banner_image}
            imagePathMobile={data?.banner_image}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>
        <Container>
          {data?.shorts?.length >= 1 && <CardText info={data?.shorts} />}
          {data?.main_desc && (
            <Section>
              <CkEditor title={data?.main_title} caption={data?.main_desc} />
            </Section>
          )}

          {data?.advantages?.length >= 1 && (
            <GridCardThin
              title={t('privige')}
              data={data?.advantages?.map((item) => ({
                title: item?.desc,
                icon: item?.icon,
                id: item?.id,
              }))}
            />
          )}
          {data?.second_desc && (
            <CkEditor title={data.second_title} caption={data.second_desc} />
          )}
          {data?.sections.length >= 1 && (
            <HeadingWithNav title={data.sections_title} />
          )}
          {data?.sections.length >= 1 && (
            <TabDefault tabs={data.sections} accardion={data.faqs} />
          )}
          {data?.calc_currencies?.length !== 0 && data?.show_calculator && (
            <Calculator isCredit calcCurrencies={data?.calc_currencies} />
          )}
          {data?.steps.length >= 1 && (
            <GridCardNumber title={t('method_credit')} data={data.steps} />
          )}
          {isApplicationEnabled && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                hrefLink={{
                  pathname: Router?.query?.slug?.includes(
                    'nakopitelnaya-ipoteka-gik'
                  )
                    ? '/online-service/savings-mortgage'
                    : `/credits/order-credit`,
                  query: {
                    ...(Router?.query?.for_who === 'legal'
                      ? { for_who: 'legal' }
                      : {}),
                    type: String(data?.id),
                  },
                }}
                className={style.buttonStyle}
                value={t('setting.button_request')}
              />
            </div>
          )}
        </Container>
      </div>
    </>
  )
}

export default Credits
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const lang: any = locale
  const [creditRes, infoRes] = await Promise.all([
    CreditsApi.getCreditsId(query?.slug as string, locale || 'ru'),
    CreditOrderApi.getCreditOrderInfo(locale || 'ru'),
  ])

  return {
    props: {
      data: creditRes.data,
      isApplicationEnabled: infoRes.data
        ? (infoRes.data.is_application_enabled ?? true)
        : true,
      ...(await getTranslations(lang)),
    },
  }
}
