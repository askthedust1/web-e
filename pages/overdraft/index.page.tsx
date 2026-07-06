import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardNumber from 'components/Grids/GridCardNumber'
import GridCardThin from 'components/Grids/GridCardThin'
import Message from 'components/Message'
import Section from 'components/Section'
import { linkPath } from 'helpers/changeTypeOfUse'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import AppImage from 'components/ui/AppImage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { OtherPageApi } from 'services/api/OtherApi'
import { OverdraftPage } from 'services/api/OtherApimodule'
import s from './overdraft.module.scss'
import { useTranslation } from 'next-i18next'

interface Props {
  data: OverdraftPage
}

const OverdraftPageCom: NextPage<Props> = ({ data }) => {
  const Router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ''}
          absolute
          currentPage={{
            title: data.banner_title,
            link: '/overdraft',
          }}
        />
      </Container>
      <Section>
        <Banner
          banner_title_hex={data?.banner_title_hex || ''}
          banner_subtitle_hex={data?.banner_subtitle_hex || ''}
          imagePath={data.banner_image}
          imagePathMobile={data.banner_image_mob}
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
          {data.properties.length >= 1 && (
            <GridCardThin data={data.properties} />
          )}
        </Section>
        <Section>
          <div className={s.innerBanner}>
            <Link
              legacyBehavior
              href={linkPath(data.inner_banner_link, Router)}
            >
              <a>
                <AppImage
                  alt={data.banner_title}
                  src={data.inner_banner}
                  width={1200}
                  height={565}
                  sizes="100vw"
                />
              </a>
            </Link>
          </div>
        </Section>
        <Section>
          {data.sections.map((item) => {
            return (
              <CkEditor key={item.id} title={item.title} caption={item.desc} />
            )
          })}
        </Section>
        {data.steps.length >= 1 && (
          <GridCardNumber title={t('method_credit')} data={data.steps} />
        )}
        {data.caption && <Message title={data.caption} warning />}
      </Container>
    </>
  )
}

export default OverdraftPageCom

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await OtherPageApi.getOverDraftPage(locale || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
