import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Section from 'components/Section'
import Table from 'components/Table'
import TableSafeBox from 'components/Tables/TableSafeBox'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { SafeBoxed } from 'services/api/OtherApimodule'

const panels = [
  {
    title: 'Виды ячеек',
    titleEn: 'Cell types',
    titleKg: 'Ячейкалардын түрлөрү',
    id: 1,
  },
  {
    title: 'длина',
    titleEn: 'length',
    titleKg: 'узундугу',
    id: 2,
  },
  {
    title: 'ширина',
    titleEn: 'width',
    titleKg: 'кең',
    id: 3,
  },
  {
    title: 'глубина',
    titleEn: 'depth',
    titleKg: 'тереңдик',
    id: 4,
  },
]
interface Props {
  data: SafeBoxed
}
const SafeBoxes: NextPage<Props> = ({ data }) => {
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/safe-boxes',
          }}
        />
      </Container>
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
      <Container>
        <Section>
          <CkEditor caption={data.about} />
        </Section>
        <Section>
          {data.prices_lists && <TableSafeBox data={data.prices_lists} />}
        </Section>
        {data?.sizes_lists.map((item) => (
          <Section key={item.id}>
            <Table
              panels={panels}
              title={item.title}
              data={item.sizes.map((tab) => ({
                id: tab.id,
                first: tab?.safebox,
                second: tab?.length,
                third: tab?.width,
                fourh: tab?.depth,
              }))}
            />
          </Section>
        ))}
      </Container>
    </>
  )
}

export default SafeBoxes
export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getSafeBoxes(lang)
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
