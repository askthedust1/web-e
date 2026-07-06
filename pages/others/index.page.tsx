import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CardBig from 'components/Cards/CardBig'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { OtherPageApi } from 'services/api/OtherApi'
import { ListPage } from 'services/api/OtherApimodule'

interface Props {
  data: ListPage
}

const OtherPageList: NextPage<Props> = ({ data }) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('other'),
            link: '/others',
          }}
        />
      </Container>
      <Container>
        <HeadingWithNav title={t('other')} />
      </Container>
      <Container>
        {data?.others?.map((item, index) => (
          <CardBig
            key={index}
            title={item.title}
            desc={item?.short_desc}
            img={item.image}
            is_available={true}
            is_creatable={true}
            link_text={t('search.go')}
            link={{
              pathname: `${item.link}`,
              query: router.query,
            }}
          />
        ))}
      </Container>
    </>
  )
}

export default OtherPageList
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const { data } = await OtherPageApi.getOhersList(locale || 'ru', query)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
