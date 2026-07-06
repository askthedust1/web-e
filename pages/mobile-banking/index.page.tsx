import Banner from 'components/Banner'
import Section from 'components/Section'
import { useEffect, useState } from 'react'
import style from './mobile-manking.module.scss'
import { MobilebankingApi } from 'services/api/BankingApi'
import { Banking } from 'services/api/BankingModule'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import TabDinamicWithQuery from 'components/TabDinamicWithQuery'
import { useMediaQuery } from 'react-responsive'
import { checkQueryParams } from 'helpers/changeTypeOfUse'

interface Props {
  data: Banking
}

const Mobilebanking: NextPage<Props> = ({ data }) => {
  const isMobile = useMediaQuery({ maxWidth: 960 })
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  const bannerShow = isVisible && !isMobile

  return (
    <>
      <div className={style.page}>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ""}
            absolute
            currentPage={{
              title: data.banner_title,
              link: '/mobile-banking',
            }}
          />
        </Container>
        <Banner
          banner_title_hex={data?.banner_title_hex || ""}
          banner_subtitle_hex={data?.banner_subtitle_hex || ""}
          title={data.banner_title}
          subtitle={data.banner_subtitle}
          link={!bannerShow ? '' : data.banner_button_link}
          linkText={data.banner_button_text}
          imagePath={data.banner_image}
          imagePathMobile={data.banner_image_mob}
          badge={true}
          appstore={data.app_store_link}
          googleplay={data.google_play_link}
          banner_bg={data?.banner_bg}
          banner_bg_mob={data?.banner_bg_mob}
        />

        <Section>
          <div style={{ overflow: 'hidden' }}>
            <TabDinamicWithQuery blocks={data?.sections} />
          </div>
        </Section>
      </div>
    </>
  )
}

export default Mobilebanking
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const typeOfUser = checkQueryParams(query)

  const { data } = await MobilebankingApi.getBanking(locale || 'ru', typeOfUser)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
