import Head from 'next/head'
import { useRouter } from 'next/router'

const SITE_URL = 'https://eldik.kg'

const HreflangTags: React.FC = () => {
  const { asPath, locale, defaultLocale } = useRouter()
  let cleanPath = asPath.split('?')[0].split('#')[0]

  if (locale !== defaultLocale && cleanPath.startsWith(`/${locale}`)) {
    cleanPath = cleanPath.slice(`/${locale}`.length) || '/'
  }

  return (
    <Head>
      <link rel="alternate" hrefLang="ru" href={`${SITE_URL}${cleanPath}`} />
      <link rel="alternate" hrefLang="ky" href={`${SITE_URL}/ky${cleanPath}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en${cleanPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${cleanPath}`} />
    </Head>
  )
}

export default HreflangTags
