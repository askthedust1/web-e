import Container from 'components/Container'
import Icon from 'components/Icon'
import s from './headerMobile.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useState, useEffect } from 'react'
import { HeadersProps } from 'services/api/LayoutModule'
import { useRouter } from 'next/router'
import useOutside from '../../helpers/useOutside'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import SelectDropDown from 'components/SelectDropDown'
import { checkQueryParams, linkPath } from 'helpers/changeTypeOfUse'
import logoLocal from 'public/images/LogoName.png'
interface Props {
  data: HeadersProps | null
  changeTypeOfFace(type: string): void
  showTranslate?: boolean
  logo: string | null
}

const HeaderMobile: FC<Props> = ({
  data,
  changeTypeOfFace,
  showTranslate,
  logo,
}) => {
  const router: any = useRouter()
  const [dropdown, setDropdown] = useState(false)
  const { ref, isShow, setIsShow } = useOutside(false)
  const { t } = useTranslation()

  const changeLocale = (locale: string) => {
  
    router.push(
      {
        route: router.pathname,
        query: checkQueryParams(router.query),
      },
      router.asPath,
      {  locale  }
    )
  }
  useEffect(() => {
    setDropdown(false)

    return () => {}
  }, [router])

  return (
    <header className={s.headerMobile}>
      <Container>
        <div className={s.grid}>
          <div className={s.gridLeft}>
            <div className={s.burger} onClick={() => setDropdown(!dropdown)}>
              <Icon id="burger" width={24} height={24} />
            </div>
            <Link legacyBehavior href={linkPath('/', router)}>
              <a className={s.logo}>
                <Image
                  className={s.logoImage}
                  src={logo || logoLocal}
                  style={{ objectFit: 'contain' }}
                  alt="Элдик Банк"
                  width={220}
                  height={44}
                  sizes="(max-width: 640px) 152px, 220px"
                  priority={true}
                />
              </a>
            </Link>
          </div>
          <div className={s.gridRight}>
            <div
              className={s.lang}
              onClick={() => setIsShow(!isShow)}
              ref={ref}
            >
              {showTranslate && (
                <div className={s.langItem}>
                  {router.locale === 'ru' && (
                    <Icon
                      className={s.langIcon}
                      id="russ"
                      width={24}
                      height={24}
                    />
                  )}
                  {router.locale === 'ky' && (
                    <Icon
                      className={s.langIcon}
                      id="kyg"
                      width={24}
                      height={24}
                    />
                  )}
                  {router.locale === 'en' && (
                    <Icon
                      className={s.langIcon}
                      id="usal"
                      width={24}
                      height={24}
                    />
                  )}
                  {!isShow ? (
                    <Icon
                      className={s.langIconArrow}
                      width={12}
                      height={12}
                      id="arrow-down-thin"
                    />
                  ) : (
                    <Icon
                      className={s.langIconArrow}
                      width={12}
                      height={12}
                      id="arrow-up-thin"
                    />
                  )}
                </div>
              )}
              {isShow && (
                <div className={s.langDropdown}>
                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('ru')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="russ"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}>Русский</p>
                  </div>
                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('ky')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="kyg"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}>Кыргызча</p>
                  </div>
                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('en')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="usal"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}> English</p>
                  </div>
                </div>
              )}
            </div>
            <Link legacyBehavior href={linkPath('/search', router)}>
              <a className={s.search}>
                <Icon id="search" width={24} height={24} />
              </a>
            </Link>
          </div>
        </div>
      </Container>
      <div
        onClick={() => setDropdown(!dropdown)}
        className={clsx(dropdown && s.overlay)}
      ></div>
      <div className={`${s.headerDropdown} ${dropdown ? s.active : ''}`}>
        <div className={s.headerDropdownBackPlate} />
        <div className={s.headerDropdownHeader}>
          <Link legacyBehavior href={linkPath('/', router)}>
            <a>
              <Image
                alt="Элдик Банк"
                src={logo || logoLocal}
                width={152}
                height={34}
                style={{ objectFit: 'contain' }}
              />
            </a>
          </Link>

          <div className={s.close} onClick={() => setDropdown(!dropdown)}>
            <Icon id="cross" width={10} height={10} />
          </div>
        </div>
        <div className={s.headerDropdownBody}>
          <div className={s.headerDropdownTab}>
            <div
              onClick={() => changeTypeOfFace('individual')}
              className={clsx(
                s.headerDropdownTabItem,
                String(router.query?.for_who) === 'individual' &&
                  s.typeOfactive,
                !router.query?.for_who?.length && s.typeOfactive
              )}
            >
              {' '}
              {t('type_face.individual')}
            </div>
            <div
              onClick={() => changeTypeOfFace('legal')}
              className={clsx(
                s.headerDropdownTabItem,
                router.query?.for_who === 'legal' && s.typeOfactive
              )}
            >
              {' '}
              {t('type_face.legal')}
            </div>
          </div>

          {data?.bottom_links?.map((item, index) => (
            <SelectDropDown key={index} links={item} />
          ))}
          <div className={s.topLeft}>
            {data?.top_left_links.map((item, index) => (
              <Link legacyBehavior href={linkPath(item.page_path, router)} key={index}>
                <a className={`${s.bottomLink} light-14`}>{item.title}</a>
              </Link>
            ))}
          </div>
          <div className={s.topRight}>
            {data?.top_right_links.map((item) => (
              <Link legacyBehavior href={linkPath(item.page_path, router)} key={item.id}>
                <a className={`${s.bottomLink} light-14`}>{item.title}</a>
              </Link>
            ))}
          </div>
          <a
            className={s.yellowBtn}
            target="_blank"
            href={data?.right_button_path}
            rel="noopener noreferrer"
          >
            {data?.right_button_text}
          </a>
        </div>
      </div>
    </header>
  )
}

export default HeaderMobile
