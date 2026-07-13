import { FC } from 'react'
import clsx from 'clsx'
import Container from 'components/Container'
import FooterAboutBank from 'components/Footer/FooterAboutBank'
import { FooterProps, SiteSettingProps } from 'services/api/LayoutModule'
import SelectDropDownDefault from 'components/SelectDropDownDefault'
import { useMediaQuery } from 'react-responsive'
import FooterBanner from './FooterBanner'
import FooterContactBand from './FooterContactBand'
import style from './footer.module.scss'

interface Props {
  data: FooterProps[] | null
  contact: SiteSettingProps | null
  dark?: boolean
}

const Footer: FC<Props> = ({ data, contact, dark = false }) => {
  const isMobile = useMediaQuery({ maxWidth: 960 })
  const isVisible = isMobile ? true : false

  return (
    <div className={clsx(style.footer, dark && style.dark)}>
      <div className={style.card}>
        <Container>
          {/* Верх — колонки ссылок */}
          <div className={style.footer__grid}>
            {!isVisible
              ? data?.map(
                  (item) =>
                    item.is_active && (
                      <FooterAboutBank key={item.id} data={item} />
                    )
                )
              : data?.map(
                  (item) =>
                    item.is_active && (
                      <SelectDropDownDefault
                        key={item.id}
                        data={{
                          title: item.title,
                          links: item.footer_links,
                          id: item.id,
                        }}
                      />
                    )
                )}
          </div>
        </Container>

        {/* Баннер приложения — на всю ширину карточки */}
        <FooterBanner data={contact} />

        <Container>
          {/* Низ — строка контактов */}
          <FooterContactBand data={contact} />
        </Container>
      </div>
    </div>
  )
}

export default Footer
