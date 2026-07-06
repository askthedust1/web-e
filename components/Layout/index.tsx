import React, { useEffect, useState } from 'react'
import Header from 'components/Header'
import HeaderMobile from 'components/HeaderMobile'
import Contact from 'components/Contact'
import Footer from 'components/Footer'
import { useRouter } from 'next/router'
import { FORMS_ROUTES } from 'constants/form-routes'
import { LayoutApi } from 'services/api/LayoutApi'
import { LayoutDataProps } from 'services/api/LayoutModule'
import { changeTypeOfUser, checkQueryParams } from 'helpers/changeTypeOfUse'
import HreflangTags from 'components/HreflangTags'

interface Layout {
  children: React.ReactNode
}

const Layout: React.FC<Layout> = ({ children }: Layout) => {
  const Router: any = useRouter()
  const { locale } = useRouter()

  const [layout, setLayout] = useState<null | LayoutDataProps>(null)
  const _HEADERS_CHECK = FORMS_ROUTES.filter(
    (item) => item.label === Router.pathname
  )

  const getData = async () => {
    try {
      const layOutInfo = await LayoutApi.getHeader(
        locale || 'ru',
        checkQueryParams(Router.query)
      )
      setLayout(layOutInfo?.data)
    } catch (error) {
      console.error('Layout fetch error:', error)
    }
  }

  const changeTypeOfFace = (type: string) => {
    changeTypeOfUser(Router, type)
  }

  useEffect(() => {
    getData()
  }, [locale, Router?.query?.for_who])
  const headerData = layout?.header || null
  const footerData = layout?.footer_sections || null
  const setting = layout?.site_settings || null
  const logo = layout?.site_settings?.logo || null
  const _trust_phone = layout?.site_settings?.trust_phone || null

  return (
    <>
      <a href="#main-content" className="visually-hidden" style={{ position: 'absolute', zIndex: 9999, top: 0, left: 0, padding: '12px 24px', background: 'var(--BLUE)', color: '#fff', textDecoration: 'none', fontSize: '16px' }}>
        Перейти к содержимому
      </a>
      <HreflangTags />
      <Header
        logo={logo}
        showTranslate={setting?.show_translation}
        changeTypeOfFace={changeTypeOfFace}
        data={headerData}
      />
      <HeaderMobile
        logo={logo}
        showTranslate={setting?.show_translation}
        changeTypeOfFace={changeTypeOfFace}
        data={headerData}
      />
      <main id="main-content">{children}</main>
      <Contact contact={setting} />
      <Footer data={footerData} contact={setting} />
    </>
  )
}

export default Layout
