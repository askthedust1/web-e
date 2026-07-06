import Banner from 'components/Banner'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Section from 'components/Section'
import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { OtherPageApi } from 'services/api/OtherApi'
import { DiscountPage } from 'services/api/OtherApimodule'
import TabDefault from 'components/Tab'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'

interface DiscountClubProps {
  data: DiscountPage
}
const DiscountClub: NextPage<DiscountClubProps> = ({
  data,
}: DiscountClubProps) => {
  const panels = [
    {
      title: 'Наименование',
      titleEn: 'Name',
      titleKg: 'Аты',
      id: 1,
    },
    {
      title: 'Скидка',
      titleEn: 'Discount',
      titleKg: 'Арзандатуу',
      id: 2,
    },
    {
      title: 'Адрес',
      titleEn: 'Address',
      titleKg: 'Дареги',
      id: 3,
    },
  ]

  const tabs = data?.cards?.map((item) => ({
    id: item.id,
    title: item.name,
    table: item.discounts.map((table) => ({
      id: table.id,
      first: table.name,
      second: table.discount + '%',
      third: table.address,
    })),
  }))
  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ""}
            absolute
            currentPage={{
              title: data.banner_title,
              link: '/discount',
            }}
          />
        </Container>
        <Section>
          <Section>
            <Banner
              banner_title_hex={data?.banner_title_hex || ""}
              banner_subtitle_hex={data?.banner_subtitle_hex || ""}
              imagePath={data.banner_image}
              imagePathMobile={data.banner_image_mob}
              link={data.banner_button_link}
              linkText={data.banner_button_text}
              subtitle={data.banner_subtitle}
              title={data.banner_title}
              banner_bg={data?.banner_bg}
              banner_bg_mob={data?.banner_bg_mob}
            />
          </Section>

          <Section>
            <Container>
              <CkEditor title={data.main_title} caption={data.about} />
              <Section>
                <Container>
                  <TabDefault titles={panels} tabs={tabs} />
                </Container>
              </Section>
            </Container>
          </Section>
        </Section>
      </div>
    </>
  )
}

export default DiscountClub
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await OtherPageApi.getDiscount(locale || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
