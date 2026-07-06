import React from 'react'
import Link from 'next/link'
import style from 'components/Footer/footer.module.scss'
import { FC } from 'react'
import { FooterProps } from 'services/api/LayoutModule'

interface Props {
  data: FooterProps
}
const FooterAboutBank: FC<Props> = ({ data }) => {
  return (
    <div className={style.footer__grid__item}>
      <h4 className={`${style.title} regular-18`}>{data.title}</h4>
      <ul className={style.list}>
        {data.footer_links.map((item) => (
          <li key={item.id}>
            <Link legacyBehavior href={item.page_path}>
              <a className={`${style.link} light-14`}>{item?.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterAboutBank
