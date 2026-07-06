import CkEditor from 'components/CkEditor'
import GridCardThin from 'components/Grids/GridCardThin'
import Section from 'components/Section'
import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import style from '../transfer.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import { TransfersApi } from 'services/api/TransfersApi'
import { TransferTypeOne } from 'services/api/TransfersApi.models'
import Accordion from 'components/Accordion'
import Document from 'components/Document'
import Message from 'components/Message'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import IframeCustom from 'components/Iframe'
import Banner from 'components/Banner'
import { useTranslation } from 'next-i18next'

interface TransfersProps {
  data: TransferTypeOne
}

const Transfers: NextPage<TransfersProps> = ({ data }: TransfersProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Section className={style.page}>
        <Container>
          <BreadCrumbsCustom
            color={data?.banner_title_hex || ''}
            absolute
            currentPage={{
              title: t('pages_names.transfers'),
              link: '/transfers',
            }}
            slug={{
              title: data?.main_title,
              link: data?.slug,
            }}
          />
        </Container>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ''}
            banner_subtitle_hex={data?.banner_subtitle_hex || ''}
            title={data?.banner_title}
            subtitle={data?.banner_subtitle}
            link={data?.banner_button_link}
            linkText={data?.banner_button_text}
            imagePath={data?.banner_image}
            imagePathMobile={data?.banner_image}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>

        <Container>
          <Section isMedium className={style.grid}>
            <CkEditor
              title={data?.main_title}
              caption={data?.main_body}
              description={data?.main_body_caption}
              link={data?.action_url}
              linkText={data?.action_text}
            />

            {data?.image && (
              <div className={style.logoWrapper}>
                <AppImage
                  alt={`${data?.id}`}
                  className={style.logo}
                  src={data?.image}
                  width={200}
                  height={200}
                />
              </div>
            )}
          </Section>
        </Container>
        {data?.iframe && <IframeCustom link={data.iframe} />}
        {data?.advantages?.length !== 0 && (
          <GridCardThin title={t('privige')} data={data?.advantages} />
        )}

        <Container>
          {(data?.main_title2 || data?.main_body2) && (
            <CkEditor title={data?.main_title2} caption={data.main_body2} />
          )}

          {data.main_title3 && (
            <CkEditor
              title={data.main_title3}
              caption={data.main_body3}
              description={data.main_body_caption}
            />
          )}
        </Container>

        <Container>
          <Section>
            {data?.red_caption && <Message title={data.red_caption} danger />}
            {data?.grey_caption && (
              <Message title={data.grey_caption} warning />
            )}
          </Section>
          <Section>
            {data?.contacts && (
              <CkEditor
                title={t('info_page.contacts_page')}
                caption={data.contacts}
              />
            )}
          </Section>
          <Section>
            {data?.currencies && (
              <CkEditor
                title={t('setting.сurrencies')}
                caption={data.currencies}
              />
            )}
          </Section>

          {data?.faqs.length !== 0 && <Accordion accardion={data?.faqs} />}
          {data?.documents.length !== 0 && (
            <Document title={t('need_doc')} documents={data.documents} />
          )}
          {data?.documents && (
            <CkEditor title={data.extra_title} caption={data.extra_body} />
          )}
        </Container>
        {/* </TransfersLayout> */}
      </Section>
    </>
  )
}

export default Transfers
export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const { data } = await TransfersApi.getTransfersId(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
