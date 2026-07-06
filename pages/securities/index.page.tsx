import React from 'react'
import Banner from 'components/Banner'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Document from 'components/Document'
import Message from 'components/Message'
import Section from 'components/Section'
import TableSecurities from 'components/Tables/TableSecurities'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { OtherPageApi } from 'services/api/OtherApi'
import { Securities } from 'services/api/OtherApimodule'

interface SecuritiesProps {
  data: Securities
}

const SecuritiesCom: NextPage<SecuritiesProps> = ({ data }: SecuritiesProps) => {
  const { t } = useTranslation()
  const titlesN = [t('operation_page.nbkr'), t('setting.tariffs')]
  const titlesG = [t('operation_page.gro'), t('setting.tariffs')]
  return (
    <>
      <Container>
        <BreadCrumbsCustom
          color={data?.banner_title_hex || ""}
          absolute
          currentPage={{
            title: data?.banner_title,
            link: '/securities',
          }}
        />
      </Container>
      <Section>
        <Section>
          <Banner
            banner_title_hex={data?.banner_title_hex || ""}
            banner_subtitle_hex={data?.banner_subtitle_hex || ""}
            imagePath={data?.banner_image}
            imagePathMobile={data?.banner_image_mob}
            link={data?.banner_button_link}
            linkText={data?.banner_button_text}
            subtitle={data?.banner_subtitle}
            title={data?.banner_title}
            banner_bg={data?.banner_bg}
            banner_bg_mob={data?.banner_bg_mob}
          />
        </Section>

        <Section>
          <Container>
            <CkEditor caption={data.about} />
            {data?.blocks?.map((item) => (
              <Container key={item.id}>
                <CkEditor
                  title={item.title}
                  caption={item.caption}
                  description={item.desc}
                />
                <Document documents={item.docs} />
              </Container>
            ))}
            <Container>
              {data.gkb_sells.length >= 1 && (
                <TableSecurities titles={titlesN} data={data.gkb_sells} />
              )}
              {data.nbkr_sells.length >= 1 && (
                <TableSecurities titles={titlesG} data={data.nbkr_sells} />
              )}
            </Container>
            {data?.captions.map((item) => (
              <Message key={item.id} title={item.desc} color={item.color} />
            ))}
          </Container>
        </Section>
      </Section>
    </>
  )
}

export default SecuritiesCom
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const typeOfUser = checkQueryParams(query)
  const { data } = await OtherPageApi.getSecurities(locale || 'ru', typeOfUser)
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
