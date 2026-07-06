import clsx from 'clsx'
import Icon from 'components/Icon'
import Section from 'components/Section'
import { linkPath } from 'helpers/changeTypeOfUse'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import style from './bred-crumbs-custom.module.scss'

const SITE_URL = 'https://eldik.kg'

interface Props {
  currentPage: {
    link: string
    title: string
  }
  slug?: {
    link: string
    title: string
  }
  absolute?: boolean
  isShowMain?: boolean
  color?: string
}

const BreadCrumbsCustom: FC<Props> = ({
  absolute = false,
  currentPage,
  slug,
  isShowMain = true,
  color = '',
}) => {
  const Router = useRouter()
  const { t } = useTranslation()
  const localePath = Router.locale === 'ru' ? '' : `/${Router.locale}`

  const breadcrumbItems = [
    ...(isShowMain
      ? [
          {
            name: t('pages_names.main_page'),
            item: `${SITE_URL}${localePath}/`,
          },
        ]
      : []),
    {
      name: currentPage.title,
      item: `${SITE_URL}${localePath}${currentPage.link}`,
    },
    ...(slug?.link
      ? [{ name: slug.title, item: `${SITE_URL}${localePath}${slug.link}` }]
      : []),
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }

  const IconCurrent = (
    <Icon className={style.icon} id="arrow-right" width={19} height={21} />
  )

  return (
    <Section
      isMedium
      className={clsx(style.wrapper, absolute && style.absolute)}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      {isShowMain && (
        <div>
          <Link
            href={linkPath('/', Router)}
            style={{ color }}
            className={style.link}
          >
            <div className={style.titleWrapper}>
              <p className={clsx('light-14', style.p)}>
                {t('pages_names.main_page')}
              </p>
              {IconCurrent}
            </div>
          </Link>
        </div>
      )}

      <div>
        <Link
          href={linkPath(currentPage.link, Router)}
          style={{ color }}
          className={style.link}
        >
          <div className={style.titleWrapper}>
            <p className={clsx('light-14', style.p)}>{currentPage.title}</p>
            {slug && IconCurrent}
          </div>
        </Link>
      </div>

      {slug?.link && (
        <div>
          <Link
            href={linkPath(slug.link, Router)}
            style={{ color }}
            className={style.link}
          >
            <div className={style.titleWrapper}>
              <p className={clsx('light-14', style.p)}>{slug.title}</p>
            </div>
          </Link>
        </div>
      )}
    </Section>
  )
}

export default BreadCrumbsCustom
