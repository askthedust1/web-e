import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import TableGoldBars from 'components/Tables/TableGoldBars/TableGoldBars'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import React from 'react'
import { OtherPageApi } from 'services/api/OtherApi'
import { GoldBars } from 'services/api/OtherApimodule'

interface GoldBarsProps {
  data: GoldBars
}

const GoldBarsCom: NextPage<GoldBarsProps> = ({ data }: GoldBarsProps) => {
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data?.banner_title,
            link: '/gold-bars',
          }}
        />
      </Container>
      <Section>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ""}
            banner_subtitle_hex={data?.banner_subtitle_hex || ""}
            imagePath={data?.banner_image}
            imagePathMobile={data?.banner_image_mob}
            link={data?.banner_button_link}
            linkText={data.banner_button_text}
            subtitle={data.banner_subtitle}
            title={data.banner_title}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>

        <Section>
          <Container>
            <Section>
              <CkEditor caption={data?.about} />
            </Section>

            <GridCardThin title={data?.title1} data={data?.infos} />
            <Section>
              <TableGoldBars data={data?.tech_specs} title={data?.title2} />
            </Section>

            {data?.blocks?.map((item) => (
              <Section key={item.id}>
                <CkEditor title={item?.title} caption={item?.desc} />
              </Section>
            ))}
          </Container>
        </Section>
      </Section>
    </>
  )
}

export default GoldBarsCom

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await OtherPageApi.getGoldBars(locale || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
