import clsx from 'clsx'
import Icon from 'components/Icon'
import { linkPath } from 'helpers/changeTypeOfUse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, FC } from 'react'
import s from './select-drop-down-default.module.scss'

interface Props {
  data: {
    title: string
    links: {
      id: number
      title: string
      page_path: string
    }[]
    id: number
  }
}

const SelectDropDownDefault: FC<Props> = ({ data }) => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const router = useRouter()
  const toggle = () => {
    setIsShow(!isShow)
  }
  const IconUpDown = !isShow ? (
    <Icon className={s.icon} id="arrow-up-thin" width={15} height={20} />
  ) : (
    <Icon className={s.icon} id="arrow-down-thin" width={15} height={20} />
  )
  return (
    <div>
      <div onClick={() => toggle()} className={s.container}>
        <p className={clsx(s.title, 'medium-16 ')}>{data.title}</p>
        {IconUpDown}
      </div>
      <ol className={clsx(s.ol, isShow && s.active)}>
        {data.links.map((link) => (
          <Link legacyBehavior key={link.id} href={linkPath(link.page_path, router)}>
            <a href="" className={s.bottomLink}>
              <li className={clsx(s.liTitle, 'light-14')}>{link.title}</li>
            </a>
          </Link>
        ))}
      </ol>
    </div>
  )
}

export default SelectDropDownDefault
