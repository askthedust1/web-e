import { GetServerSideProps, NextPage } from "next";
import Section from "components/Section";
import Banner from "components/Banner";
import CkEditor from "components/CkEditor";
import GridCardThin from "components/Grids/GridCardThin";
import Container from "components/Container";
import Message from "components/Message";
import Document from "components/Document";
import CarouselsCardThird from "components/Carousels/CarouselsCardThird";
import CardText from "components/Cards/CardText";
import { CardsApi } from "services/api/CardsApi";
import CarouselCardGrey from "components/Carousels/CarouselCardGrey";
import { BankCardsTypeOne } from "services/api/CardsApModule";
import TableCards from "components/Tables/TableCards";
import { getTranslations } from 'helpers/serverTranslations';
import BreadCrumbsCustom from "components/BreadCrumbsCustom";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";


interface BankCardsProps {
  data: BankCardsTypeOne;
}

const BankCards: NextPage<BankCardsProps> = ({ data }: BankCardsProps) => {

  const { t } = useTranslation()
  const Router = useRouter()

  const titles = [t("deposit_period"), t("in_som"), t("in_dollar")];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: data?.banner_title,
    description: data?.banner_subtitle,
    provider: {
      '@type': 'BankOrCreditUnion',
      name: 'Элдик Банк',
      url: 'https://eldik.kg',
    },
    url: `https://eldik.kg/bank-cards/${Router?.query?.slug}`,
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>
      <div>
        <Container> <BreadCrumbsCustom absolute currentPage={{
          title: t("cards.bank_card_title"),
          link: "/bank-cards"
        }} slug={{
          title: data.banner_title,
          link: data.slug
        }} /></Container>

        <Section>
          <Banner
            title={data.banner_title}
            subtitle={data.banner_subtitle}
            linkObj={{
              pathname: data.banner_button_link,
              query: { type: String(data?.id) }

            }}
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
            <CkEditor is_available={data.is_available} title={data.banner_title} caption={data.short_desc} />
          </Section>
          {data.card_infos?.length >= 1 && <CardText info={data.card_infos} />}
          {data.advantages?.length >= 1 && (
            <GridCardThin
              title={t("privige")}
              data={data.advantages}
            />
          )}

          {data?.fills?.length >= 1 && (
            <TableCards
              title={t("deposit_accrual")}
              titles={titles}
              data={data.fills}
            />
          )}
          {data.privileges.length >= 1 && (
            <CarouselsCardThird title={t("privileges")} data={data.privileges} />
          )}
          {
            data?.captions?.map((item) => (
              <Section key={item.id}><Message title={item.title} color={item.color} /></Section>

            ))}
          <Section>{data.docs && <Document title={t("doc")} documents={data.docs} />}</Section>

          {data.other_cards.length >= 1 && (
            <CarouselCardGrey title={t("other_card")} data={data.other_cards} path="/bank-cards/" />
          )}
        </Container>
      </div>
    </>
  );
};

export default BankCards;

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const lang: any = locale
  const { data } = await CardsApi.getCardSlug(params?.slug as string, locale || "ru");
  return {
    props: {
      data,
      ...(await getTranslations(lang))
    },
  };
};
