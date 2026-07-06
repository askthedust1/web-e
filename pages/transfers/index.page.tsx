import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import { Transfers } from 'models/transfers'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { TransfersSystemProps } from 'services/api/TransfersApi.models'
import style from './transfer.module.scss'
import Section from 'components/Section'
import HeadingWithNav from 'components/Heading/Heading'
import CardBig from 'components/Cards/CardBig'
import CkEditor from 'components/CkEditor'
import GridCardThin from 'components/Grids/GridCardThin'
import Message from 'components/Message'
import { TransfersApi } from 'services/api/TransfersApi'
import { getTranslations } from 'helpers/serverTranslations'
interface TransfersProps {
  data: Transfers
  transfers: TransfersSystemProps
}

const TransfersCom: NextPage<TransfersProps> = ({
  data,
  transfers,
}: TransfersProps) => {
  const { t } = useTranslation()
  const router = useRouter()
 
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: data.banner_title,
            link: '/transfers',
          }}
        />
      </Container>
      <div className={style.page}>
        <Section>
          <Container>
            <HeadingWithNav title={data.banner_title} />
          </Container>
        </Section>

        {transfers?.results?.map((item) => (
          <CardBig
            img={item.image}
            title={item.name}
            desc={item.short_desc}
            key={item.id}
            shorts={item.shorts}
            link={{
              pathname: `/transfers/${item.slug}`,
              query: { ...router.query },
            }}
            link_text={t('search.go')}
          />
        ))}
        <Section>
          <CkEditor
            title={data?.main_title}
            caption={data?.main_body}
            description={data?.main_body_caption}
          />
        </Section>
        <GridCardThin title={data?.main_title2} data={data?.advantages} />
        <Section>
          <CkEditor description={data?.main_body2} />
        </Section>
        <Section>
          <Container>
            <Message title={data?.red_caption} danger />
          </Container>
        </Section>
        <Section>
          <CkEditor title={data.main_title3} description={data?.main_body3} />
        </Section>
      </div>
    </>
  )
}

export default TransfersCom

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const [{ data }, transfer_systems, translations] = await Promise.all([
    TransfersApi.getTransfers((locale as string) || 'ru'),
    TransfersApi.getTransfersSystem((locale as string) || 'ru'),
    getTranslations(locale as string),
  ])

  return {
    props: { data, transfers: transfer_systems.data, ...translations },
  }
}
