import style from './card-gray.module.scss'
import AppImage from 'components/ui/AppImage'
import Button from 'components/Buttons/Button'
import parse from 'html-react-parser'
import { FC } from 'react'
import { useTranslation } from 'next-i18next'

interface itemProps {
  image: string
  id: number
  slug: string
  name: string
  short_desc: string
  image_mob: string
  is_creatable: boolean
  category: {
    id: number
    name: string
  }
  payment_system: {
    id: number
    name: string
    image: string
  }
}
;[]
interface CarGraypProps {
  item: itemProps
  href: string
}

const CarGray: FC<CarGraypProps> = ({ item, href }: CarGraypProps) => {
  const { t } = useTranslation()
  return (
    <div className={style.card}>
      <div className={style.imageWrapper}>
        <AppImage
          alt={item?.name || ''}
          className={style.image}
          src={item?.image || '/'}
          width={250}
          height={150}
        />
      </div>
      <div className={style.info}>
        <h3 className={`${style.title} medium-20`}>{item?.name}</h3>
        <div className={`${style.desc} light-16 forVisual`}>
          {parse(item?.short_desc)}
        </div>
        <div>
          <Button value={t('setting.button_more')} href={href} isOutline />
        </div>
      </div>
    </div>
  )
}

export default CarGray
