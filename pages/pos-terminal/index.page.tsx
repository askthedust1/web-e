import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import React, { useRef } from 'react'
import { OtherPageApi } from 'services/api/OtherApi'
import { PostTerminalPage } from 'services/api/OtherApimodule'
import StepsCard from 'components/StepsCard'
import PaymentSystems from 'components/PaymentSystems'
import Benefits from 'components/Benefits'
import ContactBlock from 'components/ContactBlock'
import AcquiringPromo from 'components/AcquiringPromo'
import Accordion from 'components/Accordion'
import { useTranslation } from 'next-i18next'
import GetPostTerminal from 'pages/pos-terminal/order-terminal/index.page'

interface PosTerminalProps {
  data: PostTerminalPage
}

const PosTerminal: NextPage<PosTerminalProps> = ({ data }) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const steps = [
    { id: 1, title: t('pos_terminal_page.step_1'), icon: '/images/step1.png' },
    { id: 2, title: t('pos_terminal_page.step_2'), icon: '/images/step2.png' },
    { id: 3, title: t('pos_terminal_page.step_3'), icon: '/images/step3.png' },
  ]

  const benefits = [
    { id: 1, text: t('pos_terminal_page.benefit_1'), icon: '/images/ic1.svg' },
    { id: 2, text: t('pos_terminal_page.benefit_2'), icon: '/images/ic2.svg' },
    { id: 3, text: t('pos_terminal_page.benefit_3'), icon: '/images/ic3.svg' },
    { id: 4, text: t('pos_terminal_page.benefit_4'), icon: '/images/ic4.svg' },
    { id: 5, text: t('pos_terminal_page.benefit_5'), icon: '/images/ic5.svg' },
  ]

  const paymentSystems = [
    { id: 1, name: 'ЭЛКАРТ', icon: '/images/partners/elcard.png' },
    { id: 2, name: 'Visa', icon: '/images/partners/VISA-logo.png' },
    { id: 3, name: 'Mastercard', icon: '/images/partners/Mastercard.svg' },
    { id: 4, name: 'UnionPay', icon: '/images/partners/union.png' },
  ]

  const faqData = [
    { id: 1, question: t('pos_terminal_page.faq_1_q'), answer: t('pos_terminal_page.faq_1_a') },
    { id: 2, question: t('pos_terminal_page.faq_2_q'), answer: t('pos_terminal_page.faq_2_a') },
    { id: 3, question: t('pos_terminal_page.faq_3_q'), answer: t('pos_terminal_page.faq_3_a') },
    { id: 4, question: t('pos_terminal_page.faq_4_q'), answer: t('pos_terminal_page.faq_4_a') },
    { id: 5, question: t('pos_terminal_page.faq_5_q'), answer: t('pos_terminal_page.faq_5_a') },
  ]
  return (
    <>
      <div>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex}
            absolute
            currentPage={{
              title: data.banner_title,
              link: '/pos-terminal',
            }}
          />
        </Container>
        <Section>
          <Section>
            <Banner
              banner_title_hex={data?.banner_title_hex || ''}
              banner_subtitle_hex={data?.banner_subtitle_hex || ''}
              imagePath={data.banner_image}
              imagePathMobile={data.banner_image_mob}
              onButtonClick={scrollToForm}
              linkText={data.banner_button_text}
              subtitle={data.banner_subtitle}
              title={data.banner_title}
              banner_bg={data?.banner_bg}
              banner_bg_mob={data?.banner_bg_mob}
            />
          </Section>
        </Section>
        <Container>
          <Section>
            <PaymentSystems
              systems={paymentSystems}
              title={t('pos_terminal_page.payment_systems_title')}
              subtitle={t('pos_terminal_page.payment_systems_subtitle')}
            />
          </Section>
          <Section>
            <StepsCard steps={steps} title={t('pos_terminal_page.steps_title')} />
          </Section>
        </Container>

        <div ref={formRef} style={{ background: '#F8F9FA', padding: '20px 0' }}>
          <Section>
            <GetPostTerminal />
          </Section>
        </div>
      </div>

      <Container>
        <Benefits benefits={benefits} title={t('pos_terminal_page.benefits_title')} />
        <Section>
          <AcquiringPromo onClick={scrollToForm} pos />
        </Section>
        <Section>
          <ContactBlock email={'ores@eldik.kg'} pos />
        </Section>
        <Accordion title={t('pos_terminal_page.faq_title')} accardion={faqData} />
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}) => {
  const { data } = await OtherPageApi.getPostTerminalPage(locale || 'ru')
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}

export default PosTerminal
