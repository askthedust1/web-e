import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Document from 'components/Document'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { RkoProps } from 'services/api/OtherApimodule'

interface PosTerminalProps {
  data: RkoProps
}

const Rko: NextPage<PosTerminalProps> = ({ data }) => {
  const { t: _t } = useTranslation()
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/rko',
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

        <Container>
          {data?.blocks?.map((item) => (
            <Container key={item.id}>
              <CkEditor
                title={item.title}
                caption={item.caption}
                description={item.desc}
              />
              {item.docs.length !== 0 && <Document documents={item.docs} />}
              {item?.shorts && <GridCardThin data={item?.shorts} />}
            </Container>
          ))}
        </Container>
      </Section>
    </>
  )
}

export default Rko
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await OtherPageApi.getRko(locale || 'ru', typeOfUser)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
