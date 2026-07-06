import Container from 'components/Container'
import Link from 'next/link'
import Image from 'next/image'
import Icon from 'components/Icon'
import { useRouter } from 'next/router'
import s from './header.module.scss'
import { BlockLinks, HeadersProps } from 'services/api/LayoutModule'
import React, { FC, useEffect, useState } from 'react'
import useOutside from '../../helpers/useOutside'
import clsx from 'clsx'
import logoLocal from 'public/images/LogoName.png'
import { useTranslation } from 'next-i18next'
import Button from 'components/Buttons/Button'
import { checkQueryParams, linkPath } from 'helpers/changeTypeOfUse'


interface Props {
  data: HeadersProps | null
  showTranslate?: boolean
  changeTypeOfFace(type: string): void
  logo: string | null
}

const Header: FC<Props> = ({ data, changeTypeOfFace, showTranslate, logo }) => {
  const router: any = useRouter()
  const { ref, isShow, setIsShow } = useOutside(false)
  const { t } = useTranslation()
  const [dropDown, setDropdown] = useState<boolean>(false)
  const [visualImpired, SetvisualImpired] = useState<boolean>(false)
  const [dropDownData, setDownData] = useState<BlockLinks | null>(null)
  const inactiveTheme = visualImpired ? 'dark' : 'light'
  
  const changeLocale = (locale: string) => {
    router.push(
      {
        route: router.pathname,
        query: checkQueryParams(router.query),
      },
      router.asPath,
      { locale }
    )

    
  }

  const showDropdown = (id: number) => {
    setDropdown(true)
    const checkt: any = data?.bottom_links.filter((item) => item.id === id)[0]
    setDownData(checkt)
  }

  const toggleVisualImpired = () => {
    SetvisualImpired(!visualImpired)
  }

  useEffect(() => {
    document.body.dataset.theme = inactiveTheme
  }, [visualImpired])
  
  return (
    <>
      <header className={s.wrapper}>
        <div className={s.top} onMouseEnter={() => setDropdown(false)}>
          <Container>
            <div className={s.topGrid}>
              <div className={s.topLeft}>
                {data?.top_left_links.map((item) => (
                  <Link legacyBehavior href={linkPath(item.page_path, router)} key={item.id}>
                    <a className={clsx(s.flashing, s.topLink, 'light-14')}>
                      {item.title}
                    </a>
                  </Link>
                ))}
              </div>
              <div className={s.topRight}>
                {data?.top_right_links.map((item) => (
                  <Link legacyBehavior href={linkPath(item.page_path, router)} key={item.id}>
                    <a className={clsx(s.topLink, 'light-14')}>{item.title}</a>
                  </Link>
                ))}
                <div
                  className={s.lang}
                  onClick={() => setIsShow(!isShow)}
                  ref={ref}
                >
                  {showTranslate && (
                    <div className={s.langItem}>
                      {router.locale === 'ky' && (
                        <Icon
                          className={s.langIcon}
                          id="kyg"
                          width={24}
                          height={24}
                        />
                      )}
                      {router.locale === 'ru' && (
                        <Icon
                          className={s.langIcon}
                          id="russ"
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
                        onClick={() => changeLocale('ky')}
                      >
                        <Icon
                          className={s.langIcon}
                          id="kyg"
                          width={24}
                          height={24}
                        />
                        <p className={clsx(s.langTitle, 'light-14')}>
                          Кыргызча
                        </p>
                      </div>
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
                        onClick={() => changeLocale('en')}
                      >
                        <Icon
                          className={s.langIcon}
                          id="usal"
                          width={24}
                          height={24}
                        />
                        <p className={clsx(s.langTitle, 'light-14')}>
                          {' '}
                          English
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => toggleVisualImpired()}
                  className={s.glasses}
                >
                  <Icon id="glasses" width={22} height={22} />
                </div>
                <Link legacyBehavior
                  href={{
                    pathname: '/search',
                    query: { for_who: router.query.for_who },
                  }}
                >
                  <a className={s.search}>
                    <Icon id="search" width={20} height={20} />
                  </a>
                </Link>
              </div>
            </div>
          </Container>
        </div>
        <div className={s.middle} onMouseEnter={() => setDropdown(false)}>
          <Container>
            <div className={s.middleGrid}>
              <div className={s.middleLeft}>
                <Link legacyBehavior href={linkPath('/', router)}>
                  <a className={s.middleLogo}>
                    <Image
                      alt="Элдик Банк"
                      className={s.logo}
                      src={logo || logoLocal}
                      width={235}
                      height={55}
                      priority={true}
                    />
                  </a>
                </Link>
                <div className={s.middleNav}>
                  <a
                    onClick={() => changeTypeOfFace('legal')}
                    className={clsx(
                      s.middleNavLink,
                      String(router.query?.for_who) === 'legal' &&
                        s.middleNavLinkActive,
                      'light-14',
                      String(router.query?.for_who) === 'legal' &&
                        'color-white bg-black'
                    )}
                  >
                    {t('type_face.legal')}
                  </a>

                  <a
                    onClick={() => changeTypeOfFace('individual')}
                    className={clsx(
                      'light-14',
                      s.middleNavLink,
                      String(router.query?.for_who) === 'individual' &&
                        s.middleNavLinkActive,
                      !router.query?.for_who?.length && s.middleNavLinkActive,
                      String(router.query?.for_who) === 'individual' &&
                        'color-white bg-black'
                    )}
                  >
                    {t('type_face.individual')}
                  </a>
                </div>
              </div>
              <div className={s.middleRight}>
                <a
                  className={`${s.middleLink} regular-15`}
                  href={data?.right_button_path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.right_button_text}
                </a>
              </div>
            </div>
          </Container>
        </div>
        <div className={s.bottom}>
          <Container>
            <div className={s.bottomGrid}>
              {data?.bottom_links?.map((item, _index) =>
                item.page_path ? (
                  <Link legacyBehavior
                    key={item.id}
                    href={linkPath(item.page_path, router) || '#'}
                  >
                    <a
                      onClick={() => setDropdown(false)}
                      key={item.id}
                      onMouseEnter={() => showDropdown(item.id)}
                      className={`
                                        ${
                                          router.pathname === item.page_path
                                            ? 'medium-15'
                                            : 'regular-15'
                                        } 
                                        ${s.bottomLink}
                                    `}
                    >
                      {item.title}
                    </a>
                  </Link>
                ) : (
                  <p
                    onClick={() => setDropdown(false)}
                    key={item.id}
                    onMouseEnter={() => showDropdown(item.id)}
                    className={`
                                        ${
                                          router.pathname === item.page_path
                                            ? 'medium-15'
                                            : 'regular-15'
                                        } 
                                        ${s.bottomLink}
                                    `}
                  >
                    {item.title}
                  </p>
                )
              )}
            </div>
          </Container>
        </div>
        <div
          className={clsx(
            s.navDropdown,
            dropDown && dropDownData?.blocks?.length !== 0 && s.active
          )}
          onMouseLeave={() => setDropdown(false)}
        >
          <Container>
            <div className={s.navWrapper}>
              <div className={s.navs}>
                {dropDownData?.blocks?.map((item) => (
                  <ul
                    className={s.ulNav}
                    key={item.id}
                    onClick={() => setDropdown(false)}
                  >
                    {item.page_path ? (
                      <Link legacyBehavior href={linkPath(item.page_path, router)}>
                        <a className={clsx(s.link)}>
                          <p className={clsx(s.titleNav, 'medium-18')}>
                            {item.title}
                            {item.page_path && (
                              <div>
                                <Icon
                                  className={s.dropDownClose}
                                  id="dropDownClose"
                                  width={25}
                                  height={25}
                                />
                              </div>
                            )}
                          </p>
                        </a>
                      </Link>
                    ) : (
                      <p className={clsx(s.titleNav, 'medium-18')}>
                        {item.title}
                        {item.page_path && (
                          <div>
                            <Icon
                              className={s.dropDownClose}
                              id="dropDownClose"
                              width={25}
                              height={25}
                            />
                          </div>
                        )}
                      </p>
                    )}
                    {item?.links?.map((links) => (
                      <li key={links.id} className={s.liNav}>
                        <Link legacyBehavior href={linkPath(links.page_path, router)}>
                          <a
                            className={`
                                                                ${
                                                                  router.pathname ===
                                                                  links.page_path
                                                                    ? 'medium-15'
                                                                    : 'regular-15'
                                                                } 
                                                                ${s.liNav}
                                                        `}
                          >
                            {links.title}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className={s.bannerNav}>
                {dropDownData?.banner && (
                  <div
                    className={s.bannerImg}
                    style={{
                      backgroundImage: `url(${dropDownData?.banner || '/'})`,
                    }}
                  >
                    <p className={s.navTitle}>{dropDownData?.banner_title}</p>
                    <p className={s.navDecs}>{dropDownData?.banner_subtitle}</p>
                    {dropDownData?.banner_button && (
                      <Button
                        href={dropDownData?.banner_link}
                        className={s.navButton}
                        value={dropDownData?.banner_button}
                        isOutline
                        isSmall
                      />
                    )}
                  </div>
                )}
                <div
                  className={s.bannerIcon}
                  onClick={() => setDropdown(false)}
                >
                  <Icon id="cross" width={10} height={10} />
                </div>
              </div>
            </div>
          </Container>
        </div>
        {/* )} */}
      </header>
    </>
  )
}

export default Header
