import Banner from 'components/Banner'
import CardText from 'components/Cards/CardText'
import Container from 'components/Container'
import Document from 'components/Document'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { CardsApi } from 'services/api/CardsApi'
import CkEditor from 'components/CkEditor'
import CarouselsCardThird from 'components/Carousels/CarouselsCardThird'
import Message from 'components/Message'
import CarouselCardGrey from 'components/Carousels/CarouselCardGrey'
import { BankCardsTypeOne } from 'services/api/CardsApModule'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'

interface Props {
  data: BankCardsTypeOne
}
const PaymentCards: NextPage<Props> = ({ data }) => {

  const { t } = useTranslation()
  const _titles = [t('deposit_period'), t('in_som'), t('in_dollar')]


  return (
    <div>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex}
          absolute
          currentPage={{
            title: t('cards.payment_card_title'),
            link: '/payment-cards',
          }}
          slug={{
            title: data.banner_title,
            link: data.slug,
          }}
        />
      </Container>
      <Section>
        <Banner
          banner_title_hex={data?.banner_title_hex || ""}
          banner_subtitle_hex={data?.banner_subtitle_hex || ""}
          isReques={data.is_creatable}
          title={data.banner_title}
          subtitle={data.banner_subtitle}
          linkObj={{
            pathname: `/bank-cards/order-card`,
            query: { type: String(data?.id) },
          }}
          link={data.banner_button_link}
          linkText={data.banner_button_text}
          imagePath={data.banner_image}
          imagePathMobile={data.banner_image}
          badge={data.is_available}
          banner_bg={data?.banner_bg}
          banner_bg_mob={data?.banner_bg_mob}
        />
      </Section>
      <Container>
        <Section>
          {data.desc && (
            <CkEditor
              is_available={data.is_available}
              title={t('about_card')}
              caption={data.desc}
            />
          )}
        </Section>
        {data.card_infos.length >= 1 && <CardText info={data.card_infos} />}
        {data.advantages.length >= 1 && (
          <GridCardThin title={t('privige')} data={data.advantages} />
        )}
        {/* {data.fills.length >= 1 && (
          <TableCards
            title={t('deposit_accrual')}
            titles={titles}
            data={data.fills}
          />
        )} */}
        {data.privileges.length >= 1 && (
          <CarouselsCardThird title={t('privileges')} data={data.privileges} />
        )}
        {data?.captions?.map((item) => (
          <Message
            desc={item.desc}
            key={item.id}
            title={item.title}
            color={item.color}
          />
        ))}
        {data.docs.length !== 0 && (
          <Section>
            {' '}
            <Document title={t('doc')} documents={data.docs} />
          </Section>
        )}

        <CarouselCardGrey
          path="/payment-cards/"
          title={t('other_card')}
          data={data?.other_cards}
        />
      </Container>
    </div>
  )
}

export default PaymentCards
export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const lang: any = locale
  const { data } = await CardsApi.getCardSlug(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
