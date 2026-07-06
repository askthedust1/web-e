import React, { FC } from 'react'
import Container from 'components/Container'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Heading from 'components/Heading/Heading'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
import { checkQueryParams } from '../../helpers/changeTypeOfUse'
import { InternetAcquiringModule } from 'services/api/InternetAcquiringModule'
import { getTranslations } from 'helpers/serverTranslations'
import { BankingApplicataion } from 'services/api/BankingModule'
import CardBig from 'components/Cards/CardBig'
import { useRouter } from 'next/router'

interface Props {
  data: BankingApplicataion
  locale: string
}

const Acquiring: FC<Props> = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('acquiring_page.breadcrumb'),
            link: '/acquiring',
          }}
        />

        <Heading title={t('acquiring_page.title')} />
        <CardBig
          key={'Интернет-эквайринг'}
          img={'/images/acquiring.png'}
          desc={t('acquiring_page.internet_acquiring_desc')}
          title={t('acquiring_page.internet_acquiring_title')}
          linkBlue={`/internet-acquiring?for_who=${
            router.query.for_who || 'individual'
          }`}
        />
        <CardBig
          key={'POS-терминал+QR'}
          img={'/images/pos.png'}
          desc={t('acquiring_page.pos_terminal_desc')}
          title={t('acquiring_page.pos_terminal_title')}
          linkBlue={`/pos-terminal?for_who=${
            router.query.for_who || 'individual'
          }`}
        />
        <CardBig
          key={'QR'}
          img={'/images/qr-code.png'}
          desc={t('acquiring_page.qr_desc')}
          title={t('acquiring_page.qr_title')}
          linkBlue={`/online-service/qr-code?for_who=${
            router.query.for_who || 'individual'
          }`}
        />
      </Container>
    </>
  )
}

export default Acquiring

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const typeOfUser = checkQueryParams(query)
  const lang = locale || 'ru'

  const { data } = await InternetAcquiringModule.getInternetAcquiringInfo(
    lang,
    typeOfUser || 'legal'
  )

  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}
