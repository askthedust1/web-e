import { FC, useState } from 'react'
import SwiperCore, { Navigation, Mousewheel } from 'swiper'
import Container from 'components/Container'

import Section from 'components/Section'
import HeadingWithNav from 'components/Heading/Heading'
import Message from 'components/Message'
import Document from 'components/Document'
import CkEditor from 'components/CkEditor'
import { useRouter } from 'next/router'
import { BlocksSecton } from 'services/api/BankingModule'
import GridCardThin from 'components/Grids/GridCardThin'
import ImagesScroll from 'components/ImagesScroll'

import Head from 'next/head'
import CarouselNavigation from 'components/Carousels/CarouselNavigation'
import style from './tab-dinamic-with-query.module.scss'
import { useTranslation } from 'next-i18next'
SwiperCore.use([Navigation, Mousewheel])
interface Props {
  title?: string
  blocks: BlocksSecton[]
}
const TabDinamicWithQuery: FC<Props> = ({ title, blocks }) => {
  const router = useRouter()
  const { t: _t } = useTranslation()
  const [_tabActive, setTabActive] = useState<number | string>(
    blocks ? blocks[0]?.id : 1
  )
  const checkRoute = !router.query.type ? blocks[0]?.id : router.query.type
  const currentData = blocks.filter(
    (block) => String(block.id) === String(checkRoute)
  )[0]?.blocks

  const filterReg = (reg: string | number) => {
    setTabActive(reg)

    router.push(
      {
        pathname: router.pathname,
        query: { type: reg, for_who: router.query.for_who || 'individual' },
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <>
      {currentData?.map((item, index) => (
        <Head key={index}>
          <title>{item.title}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta property="og:title" content={item.title} key="og:title" />
          <meta
            property="og:description"
            content={item.desc}
            key="og:description"
          />
          <meta name="description" content={item.desc} key="description" />
          <meta name="keywords" content={item.desc} key="keywords" />
        </Head>
      ))}
      {title && (
        <div className={style.heading}>
          <HeadingWithNav title={title} />
        </div>
      )}

      <CarouselNavigation
        onClick={filterReg}
        navigation={blocks?.map((item, _index) => ({
          title: item?.title,
          id: item?.id,
        }))}
        activeTab={router.query.type || blocks[0]?.id}
      />

      <Section className={style.card}>
        <div className={style.block}>
          <Container>
            <div className={style.pannel}>
              {currentData?.map((pannel) => (
                <div key={pannel.id}>
                  {(pannel.desc || pannel.title) && (
                    <CkEditor title={pannel.title} description={pannel.desc} />
                  )}
                  {pannel?.infos?.length !== 0 && (
                    <GridCardThin data={pannel?.infos} />
                  )}
                  {pannel.docs.length !== 0 && (
                    <Document documents={pannel.docs} />
                  )}
                  {pannel.caption.length !== 0 && (
                    <Message title={pannel?.caption} warning />
                  )}
                  {pannel.images.length !== 0 && (
                    <ImagesScroll data={pannel.images} />
                  )}
                </div>
              ))}
            </div>
          </Container>
        </div>
      </Section>
    </>
  )
}

export default TabDinamicWithQuery
