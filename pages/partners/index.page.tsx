import React, { FC } from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { RscBasicPageProps } from 'services/api/OtherApimodule'
import style from './partners.module.scss'

interface PartnerLogo {
  src: string
  alt: string
  width?: number
  height?: number
}

const PARTNER_LOGOS: PartnerLogo[] = [
  { src: '/images/partners/ACAMS.png', alt: 'ACAMS' },
  { src: '/images/partners/BAKERTILLY.jpg', alt: 'BAKERTILLY' },
  { src: '/images/partners/EU.jpg', alt: 'European Union' },
  { src: '/images/partners/EY.png', alt: 'EY' },
  { src: '/images/partners/LEXIS NEXIS.png', alt: 'LEXIS NEXIS' },
  {
    src: '/images/partners/Logo_of_the_United_Nations.png',
    alt: 'United Nations',
  },
  { src: '/images/partners/OFSI.png', alt: 'OFSI' },
  { src: '/images/partners/OPPENHEIMER.jpg', alt: 'OPPENHEIMER' },
  { src: '/images/partners/UN.png', alt: 'UN' },
  { src: '/images/partners/UN Women.png', alt: 'UN Women' },
  { src: '/images/partners/union.png', alt: 'UNION PAY' },
  { src: '/images/partners/WSBI.png', alt: 'WSBI' },
  {
    src: '/images/partners/минприроды.jpg',
    alt: 'Ministry of Natural Resources',
  },
  { src: '/images/partners/партнеры 1.png', alt: 'Partners' },
  { src: '/images/partners/ADB.jpg', alt: 'ADB' },
  { src: '/images/partners/CIPS.jpg', alt: 'CIPS' },
  { src: '/images/partners/EUR BANK.jpg', alt: 'EUR BANK' },
  { src: '/images/partners/IFC.jpg', alt: 'IFC' },
  { src: '/images/partners/KPMG.jpg', alt: 'KPMG' },
  { src: '/images/partners/Mastercard.svg', alt: 'Mastercard' },
  { src: '/images/partners/UNDP.jpg', alt: 'UNDP' },
]

interface Props {
  data: RscBasicPageProps
  locale: string
}

const PartnersPage: FC<Props> = ({ data, locale: _locale }) => {
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ''}
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
            banner_title_hex={data?.banner_title_hex || ''}
            banner_subtitle_hex={data?.banner_subtitle_hex || ''}
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
      </Section>

      <Section className={style.partnersSection}>
        <Container>
          <div className={style.partnersContainer}>
            <div className={style.partnersGrid}>
              {PARTNER_LOGOS.map((logo, index) => (
                <div key={index} className={style.partnerCard}>
                  <div className={style.logoContainer}>
                    {/* eslint-disable-next-line no-restricted-syntax -- logos array mixes raster + Mastercard.svg in one loop; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className={style.logoImage}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default PartnersPage

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await OtherPageApi.getRskBasicPage(
    locale || 'ru',
    'partners' as string
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
      locale,
    },
  }
}
