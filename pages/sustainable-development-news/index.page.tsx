import { GetServerSideProps, NextPage } from 'next'
import React, { FC, useState } from 'react'
import style from './sustainableDevelopmentNews.module.scss'
import Container from 'components/Container'
import { getTranslations } from 'helpers/serverTranslations'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useRouter } from 'next/router'
import { OtherPageApi } from 'services/api/OtherApi'
import parse from 'html-react-parser'
import { useTranslation } from 'next-i18next'
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

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
  publication_date: string;
}
export interface ISectionEldikGreenDeteil {
  id: number;
  title: string;
  description?: string;
  icon: string | null;
  slug: string | null;
  content?: string;
  documents: Document[];
}

const RenderListNews:FC<{item: NewsItem}> = ({item}) => {
  const router = useRouter()

  return (
    <div className={style.itemNews}>
      <div className={style.time}>
        <div>
          <p>
            {formatDate(item.publication_date)}
          </p>
        </div>
      </div>
      <div className={style.contentText} onClick={() => router.push(`/sustainable-development/${item?.slug}?for_who=${
        router.query.for_who || 'individual'
      }`)}>{item.title}</div>
    </div>
  )
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
const SustainableDevelopmentNews: NextPage<DepozitsProps> = ({ data }: DepozitsProps) => {
  const [activeTab, _setActiveTab] = useState<number>(data[0]?.id)
  const { t } = useTranslation()

  const findData = data.find((item) => item.id === activeTab)

  return (
    <>
      <Container>
        <BreadCrumbsCustom
          currentPage={{
            title: t("sustainable_development"),
            link: '/sustainable-development',
          }}
          slug={{
            title: findData?.news_section.title || "",
            link: "/sustainable-development-news",
          }}
        />
      </Container>
      <div className={style.page}>

       <Container>
         {
           findData?.news_section ?
             <div>
               <h1>{findData.news_section?.title}</h1>
               <div>{parse(findData.news_section.description)}</div>
               <div style={{ marginTop: 30 }}>
                 {
                   findData?.news_section?.items?.map((item) => {
                     return <RenderListNews item={item} key={item.id} />
                   })
                 }
               </div>
             </div> : <h2 style={{ textAlign: 'center', marginTop: 20 }}>{t('search.not_found')}</h2>
         }
       </Container>
      </div>
    </>
  )
}

export default SustainableDevelopmentNews

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
