import { NextPage } from 'next'
import Head from 'next/head'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Hero from './components/Hero'
import VideoBlock from './components/VideoBlock'
import Benefits from './components/Benefits'
import TariffsTable from './components/TariffsTable'
import style from './world-elite.module.scss'

const WorldElitePage: NextPage = () => {
  return (
    <div className={style.wrapper}>
      <Head>
        <title>World Elite — премиальная карта | Элдик Банк</title>
        <meta
          name="description"
          content="World Elite — премиальная карта Visa Infinite от Элдик Банка. Доступ в бизнес-залы, Fast Track, кешбэк 2%, бесплатный роуминг и медицинское страхование."
        />
      </Head>
      <BreadCrumbsCustom
        absolute
        color="#ffffff"
        currentPage={{ title: 'Платежные карты', link: '/payment-cards' }}
        slug={{ title: 'World Elite', link: '/payment-cards/world-elite' }}
      />
      <Hero />
      <div className={style.videoContainer}>
        <VideoBlock />
      </div>
      <Benefits />
      <div className={style.videoContainer}>
        <VideoBlock />
      </div>
      <TariffsTable />
    </div>
  )
}

export default WorldElitePage
