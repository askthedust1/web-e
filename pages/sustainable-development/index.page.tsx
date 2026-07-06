import { GetServerSideProps, NextPage } from 'next'
import React, { useState } from 'react'
import style from './eldikGreen.module.scss'
import Heading from 'components/Heading/Heading'
import Container from 'components/Container'
import { getTranslations } from 'helpers/serverTranslations'
import { useRouter } from 'next/router'
import { OtherPageApi } from 'services/api/OtherApi'
import parse from 'html-react-parser'
import CardBig from 'components/Cards/CardBig'
import notPhoto from "public/images/no-photo.jpg";
import CarouselNavigation from 'components/Carousels/CarouselNavigation'
import { useTranslation } from 'next-i18next'


interface Document {
  id: number;
  title: string;
  file: string;
}
interface NewsItem {
  id: number;
  title: string;
  content: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
}
export interface ISectionEldikGreenDeteil {
  id: number;
  title: string;
  description?: string;
  icon: string | null;
  image: string | null;
  slug: string | null;
  content?: string;
  documents: Document[];
}

interface Page {
  id: number;
  slug: string;
  main_title: string;
  main_desc: string;
  banner_title: string;
  banner_subtitle: string;
  banner_image: string | null;
  banner_bg: string | null;
  sections: ISectionEldikGreenDeteil[];
  news_section: {
    title: string;
    id: string;
    description: string;
    items: NewsItem[];
    icon: string | null;
    slug: string | null;
  }
}
interface DepozitsProps {
  data: Page[]
}
const EldikGreen: NextPage<DepozitsProps> = ({ data }: DepozitsProps) => {
  const [activeTab, setActiveTab] = useState<number>(data?.length ? data[0]?.id : 0)
  const router = useRouter()
  const { t } = useTranslation()

  const findData = data?.find((item) => item.id === activeTab)

  if(findData) {
    return (
      <>
        <CarouselNavigation
          onClick={(value) => setActiveTab(Number(value))}
          navigation={data?.map((item) => {
            return {
              title: item?.main_title,
              id: item.id
            }
          })}
          activeTab={activeTab}
        />
        <div className={style.page}>
          <br />
          <br />
          <Container>
            <Heading title={findData?.main_title} />
            {parse(findData?.main_desc || "")}
          </Container>
          <Container>
            <div style={{marginTop: 20}}>
              {[...findData?.sections || [], findData?.news_section]?.filter((item) => item)?.map((item) => {
                return (
                  <CardBig
                    key={item?.id}
                    img={item?.icon || notPhoto || "/default.jpg"}
                    // desc={removeImgTagsAndReturnHtml(item?.description?.length > 300 ? `${item?.description.slice(0, 300)} ...` : item.description)}
                    title={item?.title}
                    // is_available={item.is_available}
                    // shorts={item.shorts}
                    linkBlue={item?.slug ? `/sustainable-development/${item?.slug}?for_who=${
                      router.query.for_who || 'individual'
                    }` : "/sustainable-development-news"}
                  />
                )
              })}
            </div>

          </Container>
        </div>
      </>
    )
  }

  return <Container>
    <h2 style={{textAlign: "center", marginTop: 20}}>{t('search.not_found')}</h2>
  </Container>
}

export default EldikGreen

export const getServerSideProps: GetServerSideProps = async ({
                                                               locale,
                                                             }) => {
  const { data } = await OtherPageApi.getSustainable(
    locale || 'ru',
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}
