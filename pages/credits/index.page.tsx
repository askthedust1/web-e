import Accordion from 'components/Accordion'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardBig from 'components/Cards/CardBig'
import ContactBlock from 'components/ContactBlock'
import Container from 'components/Container'
import Heading from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getTranslations } from 'helpers/serverTranslations'
import { CreditsApi } from 'services/api/CreditsApi'
import { Credits, CreditsList } from 'services/api/CreditsApiModule'
import { useRouter } from 'next/router'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { getCanonicalUrl } from 'helpers/canonicalUrl'
import style from './credits.module.scss'
interface CredistsProps {
  data: Credits
  creditsList: CreditsList
}
const Credists: NextPage<CredistsProps> = ({
  data,
  creditsList,
}: CredistsProps) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{data?.seo_title}</title>
        <meta name="description" content={data?.seo_description} key="description" />
        <meta name="keywords" content={data?.seo_keywords} key="keywords" />
        <meta property="og:title" content={data?.og_title || data?.seo_title} key="og:title" />
        <meta property="og:description" content={data?.og_description} key="og:description" />
        <meta property="og:image" content={data?.og_image} key="og:image" />
        <link rel="canonical" href={getCanonicalUrl(router.locale || 'ru', '/credits')} />
      </Head>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: data.main_title,
            link: '/credits',
          }}
        />
      </Container>
      <div className={style.page}>
        <Container>
          <Heading title={data.main_title} />
        </Container>

        {creditsList?.results.map((item) => (
          <CardBig
            img={item.image}
            title={item.name}
            desc={item.short_desc}
            key={item.id}
            // link={
            //   item.is_creatable
            //     ? {
            //         pathname: item?.slug?.includes("nakopitelnaya-ipoteka-gik")  ? "/online-service/savings-mortgage" : `/credits/order-credit`,
            //         query: { ...router.query, type: item.id },
            //       }
            //     : null
            // }
            shorts={item.shorts}
            linkBlue={`/credits/${item?.slug}${router.query.for_who === 'legal' ? '?for_who=legal' : ''}`}
            is_available={item.is_creatable}
          />
        ))}

        <ContactBlock
          email={data.support_email}
          phone_number={data.support_phone}
        />
        {data.faqs && <Accordion accardion={data.faqs} />}
      </div>
    </>
  )
}

export default Credists

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await CreditsApi.getCredits(locale || 'ru', typeOfUser)
  const response = await CreditsApi.getCreditsList(locale || 'ru', typeOfUser)
  const creditsList = response.data
  return {
    props: {
      data,
      creditsList,
      ...(await getTranslations(locale as string)),
    },
  }
}
