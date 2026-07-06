import Container from 'components/Container'
import { OtherPageApi } from 'services/api/OtherApi'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import CardBig from 'components/Cards/CardBig'
import { ListPage } from 'services/api/OtherApimodule'
import { useRouter } from 'next/router'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import HeadingWithNav from 'components/Heading/Heading'
import { useTranslation } from 'next-i18next'

interface Props {
  data: ListPage
}

const OnlineService: NextPage<Props> = ({ data }) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('online_service'),
            link: '/online-service',
          }}
        />
      </Container>

      <Container>
        <HeadingWithNav title={t('online_service')} />
      </Container>

      <Container>
        {data?.online_services?.map((item) => (
          <div key={item.id}>
            <CardBig
              title={item.title}
              desc={item.desc}
              img={item.image}
              is_available={true}
              is_creatable={true}
              link={{
                pathname: item.link,
                query: { ...router.query },
              }}
            />
          </div>
        ))}
      </Container>
    </>
  )
}

export default OnlineService

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const { data } = await OtherPageApi.getOnlineServiceList(locale || 'ru', {
    for_who: query.for_who || 'individual',
  })
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
