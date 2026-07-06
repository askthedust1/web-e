import Banner from 'components/Banner'
import CardText from 'components/Cards/CardText'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import GridCardNumber from 'components/Grids/GridCardNumber'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import TabDefault from 'components/Tab'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import React from 'react'
import { DepozitsApi } from 'services/api/DepozitsApi'
import { DepozitsDeteil } from 'services/api/DepozitsApiModule'
import Calculator from 'components/Calculator'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'

interface DepozitsProps {
  data: DepozitsDeteil
}
const Depozits: NextPage<DepozitsProps> = ({ data }: DepozitsProps) => {
  const { t } = useTranslation()
  const tabs = data.sections.map((item) => ({
    id: item.id,
    title: item.title,
    desc: item.main_desc,
    extra_desc: item.extra_desc,
    green_caption: item.green_caption,
    grey_caption: item.grey_caption,
    document: item.docs,
    defence: data.defense_desc,
    defenceTitle: data.defense_title,
    shorts: item.shorts,
    table: item.fills.map((table) => ({
      id: table.id,
      first: table.period,
      second: table.year_perc + '%',
      third: table.effective_perc + '%',
    })),
  }))

  const panels = [
    {
      title: 'Сроки депозита',
      titleEn: 'Deposit terms',
      titleKg: 'Депозиттин шарттары',
      id: 1,
    },
    {
      title: 'Годовая',
      titleEn: 'Yearly',
      titleKg: 'Жылдык',
      id: 2,
    },
    {
      title: 'Эффективная',
      titleEn: 'Effective',
      titleKg: 'Эффективдүү',
      id: 3,
    },
  ]

  return (
    <>
      <Section>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ''}
            absolute
            currentPage={{
              title: t('all_deposits'),
              link: '/depozits',
            }}
            slug={{
              title: data?.main_title,
              link: data?.slug,
            }}
          />
        </Container>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ''}
            banner_subtitle_hex={data?.banner_subtitle_hex || ''}
            badge={data?.is_available || true}
            title={data?.banner_title}
            subtitle={data.banner_subtitle}
            link={data.banner_button_link || ''}
            linkText={data.banner_button_text}
            imagePath={data.banner_image}
            imagePathMobile={data.banner_image_mob}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>
        <Container>
          {data?.shorts?.length >= 1 && <CardText info={data.shorts} />}
          {data?.main_desc && (
            <Section>
              <CkEditor title={data.main_title} caption={data.main_desc} />
            </Section>
          )}

          {data?.steps?.length !== 0 && (
            <GridCardNumber title={t('method_deposit')} data={data.steps} />
          )}
          {data?.opportunities?.length !== 0 && (
            <GridCardThin title={t('privige')} data={data.opportunities} />
          )}
          {data?.sections?.length >= 1 && (
            <TabDefault
              titles={panels}
              title={t('deposit_interest_rates')}
              tabs={tabs}
            />
          )}
          {data?.calc_currencies?.length !== 0 && data.show_calculator && (
            <Calculator calcCurrencies={data.calc_currencies} />
          )}
        </Container>
      </Section>
    </>
  )
}

export default Depozits

export const getServerSideProps: GetServerSideProps<DepozitsProps> = async ({
  params,
  locale,
}) => {
  const { data } = await DepozitsApi.getDepozitsId(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
