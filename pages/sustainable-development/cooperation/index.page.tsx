import React, { FC } from 'react'
import Container from 'components/Container'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { GetServerSideProps } from 'next'
import { OtherPageApi } from 'services/api/OtherApi'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import AppImage from 'components/ui/AppImage'
import styles from './cooperation.module.scss'
import { ISectionEldikGreenDeteil } from 'pages/sustainable-development/index.page'

interface Props {
  data: ISectionEldikGreenDeteil
}

const Cooperation: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const cooperationData = [
    { title: t('partner1'), image: '/images/UNGC.png', width: 89, height: 92 },
    { title: t('partner2'), image: '/images/WSBI.png', width: 117, height: 58 },
    { title: t('partner3'), image: '/images/IBC.png', width: 123, height: 113 },
    { title: t('partner4'), image: '/images/UN.png', width: 178, height: 121 },
    {
      title: t('partner5'),
      image: '/images/UNWomen.png',
      width: 140,
      height: 39,
    },
    {
      title: t('partner6'),
      image: '/images/minnature.jpg',
      width: 77,
      height: 76,
    },
    { title: t('partner7'), image: '/images/UNDP.png', width: 55, height: 112 },
    { title: t('partner8'), image: '/images/ckf.png', width: 144, height: 130 },
  ]

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t('sustainable_development'),
            link: '/sustainable-development',
          }}
          slug={{
            title: data?.title,
            link: data?.slug || '',
          }}
        />
      </Container>
      <Container>
        <h1>{data?.title}</h1>

        <div className={styles.cooperationList}>
          {cooperationData.map((item, index) => (
            <div key={index} className={styles.cooperationItem}>
              <div className={styles.imageWrapper}>
                <AppImage
                  src={item.image}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                />
              </div>
              <div className={styles.textWrapper}>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => {
  const lang: any = locale
  const { data } = await OtherPageApi.getSustainableDetail(
    'cooperation' as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(lang)),
    },
  }
}

export default Cooperation
