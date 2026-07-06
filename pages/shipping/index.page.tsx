import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { Shipping } from 'services/api/OtherApimodule'

interface ShippingProps {
  data: Shipping
}

const ShippingCom: NextPage<ShippingProps> = ({ data }: ShippingProps) => {
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/shipping',
          }}
        />
      </Container>
      <Section>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ""}
            banner_subtitle_hex={data?.banner_subtitle_hex || ""}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
            imagePath={data.banner_image}
            imagePathMobile={data.banner_image_mob}
            link={data.banner_button_link}
            linkText={data.banner_button_text}
            subtitle={data.banner_subtitle}
            title={data.banner_title}
          />
        </Section>

        <Section>
          <Container>
            {data?.about && (
              <Section>
                <CkEditor caption={data.about} />
              </Section>
            )}
            {data?.guarantee_title?.length >= 1 && (
              <GridCardThin title={data.guarantee_title} data={data.infos} />
            )}
          </Container>
        </Section>
      </Section>
    </>
  )
}

export default ShippingCom

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await OtherPageApi.getShipping(locale || 'ru', typeOfUser)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
