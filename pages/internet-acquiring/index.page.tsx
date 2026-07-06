import React, { FC, useRef } from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { InternetAcquiringModule } from 'services/api/InternetAcquiringModule'
import { BankingApplicataion } from 'services/api/BankingModule'
import { useTranslation } from 'next-i18next'
import { checkQueryParams } from '../../helpers/changeTypeOfUse'
import StepsCard from 'components/StepsCard'
import OrderInternetAcquiring from 'pages/online-service/order-internet-acquiring/index.page'
import ContactBlock from 'components/ContactBlock'

import Benefits from 'components/Benefits'
import PaymentSystems from 'components/PaymentSystems'
import AcquiringPromo from 'components/AcquiringPromo'
import Accordion from 'components/Accordion'

interface Props {
  data: BankingApplicataion
  locale: string
}
const InternetAcquiringPage: FC<Props> = ({ data, locale: _locale }) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const steps = [
    {
      id: 1,
      title: t('internet_acquiring_page.step_1'),
      icon: '/images/step1.png',
    },
    {
      id: 2,
      title: t('internet_acquiring_page.step_2'),
      icon: '/images/step2.png',
    },
    {
      id: 3,
      title: t('internet_acquiring_page.step_3'),
      icon: '/images/step3.png',
    },
  ]

  const benefits = [
    {
      id: 1,
      text: t('internet_acquiring_page.benefit_1'),
      icon: '/images/ic1.svg',
    },
    {
      id: 2,
      text: t('internet_acquiring_page.benefit_2'),
      icon: '/images/ic2.svg',
    },
    {
      id: 3,
      text: t('internet_acquiring_page.benefit_3'),
      icon: '/images/ic3.svg',
    },
    {
      id: 4,
      text: t('internet_acquiring_page.benefit_4'),
      icon: '/images/ic4.svg',
    },
    {
      id: 5,
      text: t('internet_acquiring_page.benefit_5'),
      icon: '/images/ic5.svg',
    },
  ]

  const paymentSystems = [
    { id: 1, name: 'ЭЛКАРТ', icon: '/images/partners/elcard.png' },
    { id: 2, name: 'Visa', icon: '/images/partners/VISA-logo.png' },
    { id: 3, name: 'Mastercard', icon: '/images/partners/Mastercard.svg' },
    { id: 4, name: 'UnionPay', icon: '/images/partners/union.png' },
  ]

  const faqData = [
    {
      id: 1,
      question: t('internet_acquiring_page.faq_1_q'),
      answer: t('internet_acquiring_page.faq_1_a'),
    },
    {
      id: 2,
      question: t('internet_acquiring_page.faq_2_q'),
      answer: t('internet_acquiring_page.faq_2_a'),
    },
    {
      id: 3,
      question: t('internet_acquiring_page.faq_3_q'),
      answer: t('internet_acquiring_page.faq_3_a'),
    },
    {
      id: 4,
      question: t('internet_acquiring_page.faq_4_q'),
      answer: t('internet_acquiring_page.faq_4_a'),
    },
    {
      id: 5,
      question: t('internet_acquiring_page.faq_5_q'),
      answer: t('internet_acquiring_page.faq_5_a'),
    },
    {
      id: 6,
      question: t('internet_acquiring_page.faq_6_q'),
      answer: t('internet_acquiring_page.faq_6_a'),
    },
    {
      id: 7,
      question: t('internet_acquiring_page.faq_7_q'),
      answer: t('internet_acquiring_page.faq_7_a'),
    },
    {
      id: 8,
      question: t('internet_acquiring_page.faq_8_q'),
      answer: t('internet_acquiring_page.faq_8_a'),
    },
    {
      id: 9,
      question: t('internet_acquiring_page.faq_9_q'),
      answer: t('internet_acquiring_page.faq_9_a'),
    },
    {
      id: 10,
      question: t('internet_acquiring_page.faq_10_q'),
      answer: t('internet_acquiring_page.faq_10_a'),
    },
  ]

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
            banner_subtitle_hex={'#FFDE21'}
            title={t('internet_acquiring_page.banner_title')}
            subtitle={data?.banner_subtitle}
            onButtonClick={scrollToForm}
            linkText={t('internet_acquiring_page.banner_button')}
            imagePath={data.banner_image}
            imagePathMobile={data.banner_image_mob}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>
        <Container>
          <Section>
            <PaymentSystems
              systems={paymentSystems}
              title={t('internet_acquiring_page.payment_systems_title')}
              subtitle={t('internet_acquiring_page.payment_systems_subtitle')}
            />
          </Section>
          <Section>
            <StepsCard
              steps={steps}
              title={t('internet_acquiring_page.steps_title')}
            />
          </Section>
        </Container>

        <div ref={formRef} style={{ background: '#F8F9FA', padding: '20px 0' }}>
          <Section>
            <OrderInternetAcquiring />
          </Section>
        </div>
      </div>

      <Container>
        <Benefits
          benefits={benefits}
          title={t('internet_acquiring_page.benefits_title')}
        />
        <Section>
          <AcquiringPromo onClick={scrollToForm} />
        </Section>
        <Section>
          <ContactBlock
            phone_number={'(0312) 58 01 39'}
            email={'opr@eldik.kg'}
            pos
          />
        </Section>
        <Accordion
          title={t('internet_acquiring_page.faq_title')}
          accardion={faqData}
        />
      </Container>
    </>
  )
}

export default InternetAcquiringPage

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
