import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import React from 'react'
import { LeasingApi } from 'services/api/LeasingApi'
import { LeasingDetail } from 'services/api/LeasingModule'

interface CreditsProps {
  data: LeasingDetail
}

const LeasingDetails: NextPage<CreditsProps> = ({ data }: CreditsProps) => {
  const { t } = useTranslation()
  const Router = useRouter()
  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ""}
            absolute
            currentPage={{
              title: 'Лизинг',
              link: '/leasing',
            }}
            slug={{
              title: data?.banner_title as string,
              link: data?.slug,
            }}
          />
        </Container>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ""}
            banner_subtitle_hex={data?.banner_subtitle_hex || ""}
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
          {data?.main_desc && (
            <Section>
              <CkEditor title={data?.main_title} caption={data?.main_desc} />
            </Section>
          )}

          {data?.second_desc && (
            <CkEditor title={data.second_title} caption={data.second_desc} />
          )}

        </Container>
      </div>
    </>
  )
}

export default LeasingDetails
export const getServerSideProps: GetServerSideProps = async ({
                                                               query,
                                                               locale,
                                                             }) => {
  const lang: any = locale
  const { data } = await LeasingApi.getLeasingId(
    query?.slug as string,
    locale || 'ru'
  )

  return {
    props: {
      data: data,
      ...(await getTranslations(lang)),
    },
  }
}
