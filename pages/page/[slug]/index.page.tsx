import React, { FC, useEffect } from 'react'
import Accordion from 'components/Accordion'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardText from 'components/Cards/CardText'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Document from 'components/Document'
import Message from 'components/Message'
import Section from 'components/Section'
import { GetServerSideProps } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { RscBasicPageProps } from 'services/api/OtherApimodule'
import CarouselNavigation from 'components/Carousels/CarouselNavigation'
import { useRouter } from 'next/router'
import IslamicCreditCalculator from 'components/IslamicCreditCalculator/IslamicCreditCalculator'
import { CalculatorDataApi } from 'services/api/CalculatorApi'

interface Props {
  data: RscBasicPageProps
  locale: string
}
const RskDimanicPage: FC<Props> = ({ data, locale }) => {
  const [dataCalc, setDataCalc] = React.useState<any>(null)
  const navigationHead = data?.sections?.map((item) => ({
    title: item?.name,
    id: item?.id,
  }))

  const { push, pathname, query } = useRouter()

  const onClick = (id: number, _index: number) => {
    push(
      {
        pathname: pathname,
        query: { ...query, template: id },
      },
      undefined,
      { scroll: false }
    )
  }

  const currentTabData: any =
    data?.sections?.find(
      (item) => item?.id === Number(query?.template || data?.sections[0]?.id)
    ) || []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await CalculatorDataApi.getCalculatorIslamic(locale|| 'ru', { is_shariah: true, name: currentTabData.name })
        setDataCalc(result.data)
      } catch (error) {}
    }

    if (currentTabData?.name) {
      fetchData()
    }
  }, [currentTabData])

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data?.banner_title,
            link: `/rsk/${data?.slug}`,
          }}
        />
      </Container>
      <Section>
        <Section isMedium={data?.main_title ? true : false}>
          <Banner
            banner_title_hex={data?.banner_title_hex || ""}
            banner_subtitle_hex={data?.banner_subtitle_hex || ""}
            imagePath={data?.banner_image}
            imagePathMobile={data?.banner_image_mob}
            link={data?.banner_button_link}
            linkText={data?.banner_button_text}
            subtitle={data?.banner_subtitle}
            title={data?.banner_title}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>
        <Container>
          {(data?.main_title || data?.main_desc) && (
            <Section>
              <CkEditor
                title={data?.main_title}
                description={data?.main_desc}
              />
            </Section>
          )}
        </Container>
        <CarouselNavigation
          activeTab={currentTabData?.id}
          onClick={onClick}
          navigation={navigationHead}
        />
      </Section>
      <Container>
        {currentTabData?.shorts?.length >= 1 && (
          <CardText info={currentTabData?.shorts} />
        )}
        {(currentTabData?.title || currentTabData?.desc) && (
          <Section>
            <CkEditor
              title={currentTabData?.title}
              description={currentTabData?.desc}
            />
          </Section>
        )}
        {currentTabData?.caption && (
          <Message success title={currentTabData.caption} />
        )}
        {currentTabData?.docs?.length !== 0 && (
          <Document documents={currentTabData?.docs} />
        )}
        {currentTabData?.faqs?.length !== 0 && (
          <Accordion accardion={currentTabData?.faqs} />
        )}
        {
          data?.slug === 'islam-kreditovanie' && dataCalc && dataCalc.credits.length > 0 && (
            <IslamicCreditCalculator
              credit={dataCalc.credits[0]}
              caption="Тест"
            />
          )
        }
      </Container>
    </>
  )
}

export default RskDimanicPage
export const getServerSideProps: GetServerSideProps = async ({
                                                               query,
                                                               locale,
                                                             }) => {
  const { data } = await OtherPageApi.getRskBasicPage(
    locale || 'ru',
    query.slug as string
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
      locale
    },
  }
}
