import clsx from 'clsx'
import Icon from 'components/Icon'
import { linkPath } from 'helpers/changeTypeOfUse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, FC } from 'react'
import s from './select-drop-down.module.scss'
import { isMobile, openDeepLink } from '../../helpers/openDeepLink'

interface MenuLink {
  id: number
  title: string
  page_path: string
}

interface Block {
  id: number
  title: string
  page_path: string
  links: MenuLink[]
}

interface Props {
  links: {
    id: number
    title: string
    page_path: string
    position: string
    banner: string
    banner_title: string
    banner_subtitle: string
    banner_button: string
    banner_link: string
    blocks: Block[]
  }
}

const SelectDropDown: FC<Props> = ({ links }) => {
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()
  const hasBlocks = links.blocks.length > 0

  const toggle = () => setIsShow((prev) => !prev)

  const IconArrow = (
    <Icon
      className={s.icon}
      id={isShow ? 'arrow-down-thin' : 'arrow-up-thin'}
      width={15}
      height={20}
    />
  )

  const ONLINE_LINK = '/credits/order-credit'

  const renderTopLink = () => {
    const isOnline = links.page_path === ONLINE_LINK

    if (!hasBlocks && isOnline && isMobile()) {
      return (
        <a
          className={s.bottomLink}
          onClick={(e) => {
            e.preventDefault()
            openDeepLink()
          }}
        >
          <p className={clsx(s.title, 'medium-16')}>{links.title}</p>
        </a>
      )
    }

    if (!hasBlocks) {
      return (
        <Link legacyBehavior href={linkPath(links.page_path, router)}>
          <a className={s.bottomLink}>
            <p className={clsx(s.title, 'medium-16')}>{links.title}</p>
          </a>
        </Link>
      )
    }

    return <p className={clsx(s.title, 'medium-16')}>{links.title}</p>
  }

  const renderInnerLink = (item: MenuLink) => {
    const isOnline = item.page_path === ONLINE_LINK

    if (isOnline && isMobile()) {
      return (
        <li
          key={item.id}
          className={clsx(s.li, 'light-14')}
          onClick={(e) => {
            e.preventDefault()
            openDeepLink()
          }}
        >
          {item.title}
        </li>
      )
    }

    return (
      <Link legacyBehavior href={linkPath(item.page_path, router)} key={item.id}>
        <a
          className={clsx(
            s.bottomLink,
            router.pathname === item.page_path ? 'regular-15' : 'light-14'
          )}
        >
          <li className={clsx(s.li, 'light-14')}>{item.title}</li>
        </a>
      </Link>
    )
  }

  return (
    <div>
      <div onClick={toggle} className={s.container}>
        {renderTopLink()}
        {hasBlocks && IconArrow}
      </div>

      <ol className={clsx(s.ol, isShow && s.active)}>
        {links.blocks.map((block) => (
          <div key={block.id}>
            {block.page_path ? (
              <Link legacyBehavior href={linkPath(block.page_path, router)}>
                <a
                  className={clsx(
                    s.bottomLink,
                    router.pathname === block.page_path ? 'regular-15' : 'light-14'
                  )}
                >
                  <li className={clsx(s.liTitle, 'light-16')}>
                    {block.title}
                    <Icon
                      className={s.dropDownClose}
                      id="dropDownClose"
                      width={20}
                      height={18}
                    />
                  </li>
                </a>
              </Link>
            ) : (
              <li className={clsx(s.liTitle, 'light-16')}>{block.title}</li>
            )}

            {block.links.map(renderInnerLink)}
          </div>
        ))}
      </ol>
    </div>
  )
}

export default SelectDropDown
