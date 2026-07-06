import clsx from 'clsx'
import Container from 'components/Container'
import Icon from 'components/Icon'
import { linkPath } from 'helpers/changeTypeOfUse'
import { useTranslation } from 'next-i18next'
import AppImage from 'components/ui/AppImage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import style from './header-litlle.module.scss'

interface Props {
  logo: string | null
  trust_phone: string | null
}
const HeaderLitlle: FC<Props> = ({ logo, trust_phone }) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className={style.wrapper}>
      <Container>
        <div className={style.content}>
          <div className={style.logo}>
            <Link legacyBehavior href={linkPath('/', router)}>
              <a href="">
                <AppImage alt="" src={logo || '/'} width={163} height={32} />
              </a>
            </Link>
          </div>
          <div className={style.right}>
            <a className={style.supportBlock} href={`tel: ${trust_phone}`}>
              <div className={style.support}>
                <p className={clsx(style.key, 'light-14')}>
                  {t('contacts.support')}
                </p>
                <p className={clsx(style.value, 'regular-18')}>{trust_phone}</p>
              </div>
            </a>
            <div className={style.icon}></div>
            <div className={style.saveIcon}>
              <Icon
                className={style.saveIcon}
                id="save"
                height={30}
                width={30}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default HeaderLitlle
