import { FC } from 'react'
import clsx from 'clsx'
import Container from 'components/Container'
import FooterAboutBank from 'components/Footer/FooterAboutBank'
import FooterContact from 'components/Footer/FooterContact'
import { FooterProps, SiteSettingProps } from 'services/api/LayoutModule'
import FooterQr from './FooterQr'
import SelectDropDownDefault from 'components/SelectDropDownDefault'
import { useMediaQuery } from 'react-responsive'
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
      <Container>
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

          <FooterContact data={contact} />
        </div>
      </Container>
      <div>
        <FooterQr data={contact} />
      </div>
    </div>
  )
}

export default Footer
