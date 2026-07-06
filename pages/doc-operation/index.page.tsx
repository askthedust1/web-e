import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Document from 'components/Document'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { RkoProps } from 'services/api/OtherApimodule'

interface PosTerminalProps {
  data: RkoProps
}

const DocOperation: NextPage<PosTerminalProps> = ({ data }) => {
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/doc-operation',
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
          <Section>
            {data?.blocks?.map((item) => (
              <Container key={item.id}>
                <CkEditor
                  title={item.title}
                  caption={item.desc}
                  description={item.caption}
                />
                <Document documents={item.docs} />
              </Container>
            ))}
          </Section>
        </Container>
      </Section>
    </>
  )
}
export default DocOperation
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await OtherPageApi.getDocOperation(locale || 'ru', {
    for_who: 'legal',
  })
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
