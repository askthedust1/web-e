import React, { FC, useState } from 'react'
import style from './tab.module.scss'
import Container from 'components/Container'

import Accordion from 'components/Accordion'
import Table from 'components/Table'

import Section from 'components/Section'
import HeadingWithNav from 'components/Heading/Heading'
import Message from 'components/Message'
import Document from 'components/Document'
import CkEditor from 'components/CkEditor'
import CardText from 'components/Cards/CardText'
import CarouselNavigation from 'components/Carousels/CarouselNavigation'
interface TabDefaultProps {
  tabs?: {
    id: number
    title: string
    desc?: string
    green_caption?: string
    grey_caption?: string
    extra_desc?: string
    caption?: string
    defence?: string
    defenceTitle?: string
    shorts?: { id: number; key: string; value: string }[] | any
    table?: {
      id: number
      first: string
      second: string
      third: string
    }[]
    document?: { id: number; title?: string; file: string; ext: string }[]
  }[]
  accardion?:
    | {
        answer: string
        id: number
        question: string
      }[]
    | any
  cardTable?: {
    id: number
    name: string
    discounts: {
      address: string
      discount: string
      name: string
      id: number
    }[]
  }[]
  titles?: {
    title: string
    titleEn: string
    titleKg: string
    id: number
  }[]

  title?: string
}

const TabDefault: FC<TabDefaultProps> = ({
  tabs,
  accardion,
  titles,
  title,
}: TabDefaultProps) => {
  const [tabActive, setTabActive] = useState<number>(tabs ? tabs[0]?.id : 1)
  const navigateTab = (id: number) => {
    setTabActive(id)
  }
  return (
    <>
      <div className={style.heading}>
        <HeadingWithNav title={title} />
      </div>
      <CarouselNavigation
        onClick={navigateTab}
        navigation={tabs?.map((item, _index) => ({
          title: item?.title,
          id: item?.id,
        }))}
        activeTab={tabActive}
      />

      <Section className={style.card}>
        <div className={style.block}>
          <Container>
            {tabs?.map(
              (item, index) =>
                tabActive === item.id && (
                  <>
                    <div key={index} className={`${style.panel} regular-18`}>
                      {item?.desc?.length !== 0 && (
                        <CkEditor description={item?.desc} />
                      )}

                      {accardion?.length >= 1 && (
                        <Accordion accardion={accardion} />
                      )}
                      {item?.green_caption && (
                        <Message title={item?.green_caption} success />
                      )}
                      {item.shorts && <CardText info={item.shorts} />}
                      {item?.table && (
                        <Table panels={titles} data={item.table} />
                      )}
                      {item?.grey_caption && (
                        <Message title={item?.grey_caption} warning />
                      )}
                      {/*{item?.document && <Document documents={item.document} />}*/}
                      {item?.extra_desc && (
                        <Message title={item?.extra_desc} warning />
                      )}
                      {item?.caption && (
                        <Message title={item?.caption} warning />
                      )}
                      {item?.defenceTitle && (
                        <CkEditor
                          isBanner
                          title={item.defenceTitle}
                          description={item.defence}
                        />
                      )}
                    </div>
                  </>
                )
            )}
          </Container>
        </div>
      </Section>
    </>
  )
}

export default TabDefault
