import Accordion from 'components/Accordion'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CarouselsCardThird from 'components/Carousels/CarouselsCardThird'
import CkEditor from 'components/CkEditor'
import ContactBlock from 'components/ContactBlock'
import Container from 'components/Container'
import Document from 'components/Document'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { BankingApplicataion } from 'services/api/BankingModule'
import { MobilebankingApi } from 'services/api/BankingApi'
import { useTranslation } from 'next-i18next'
import { checkQueryParams } from 'helpers/changeTypeOfUse'

interface Props {
  data: BankingApplicataion
}

const InternetBanking: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ''}
            absolute
            currentPage={{
              title: data.banner_title,
              link: '/mobile-banking',
            }}
          />
        </Container>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ''}
            banner_subtitle_hex={data?.banner_subtitle_hex || ''}
            title={data.banner_title}
            subtitle={data.banner_subtitle}
            link={data.banner_button_link}
            linkText={data.banner_button_text}
            imagePath={data.banner_image}
            imagePathMobile={data.banner_image_mob}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>
        <Container>
          {data.about && (
            <Section>
              <CkEditor title={data.banner_title} description={data.about} />
            </Section>
          )}
          <Document documents={[data.personal_data_processing]} />
          {data.opportunities.length >= 1 && (
            <CarouselsCardThird
              title={t('privige')}
              data={data.opportunities}
            />
          )}
          {data.faqs.length >= 1 && (
            <Accordion title="FAQ" accardion={data.faqs} />
          )}
          <ContactBlock
            phone_number={data?.support_phone}
            email={data.support_email}
          />
        </Container>
      </div>
    </>
  )
}

export default InternetBanking
export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await MobilebankingApi.getBankingApplication(
    locale || 'ru',
    typeOfUser
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
