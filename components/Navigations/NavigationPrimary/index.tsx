import Container from 'components/Container'
import Section from 'components/Section'
import AppImage from 'components/ui/AppImage'
import { useRouter } from 'next/router'
import React from 'react'
import style from '../navigation.module.scss'
import { FC, useState, useEffect } from 'react'
import SelectImg from 'components/Select/SelectImage'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'next-i18next'

interface NavData {
  id: number
  image: string
  is_available: boolean
  name: string
  is_open?: boolean
  is_active: boolean
}
interface Props {
  data: NavData[]
  onClick(category: number): void
  onFilterCardsMob(e: string): void
  selectedImage: string
  isCard?: boolean
}

const NavigationPrimary: FC<Props> = ({
  data,
  onClick,
  onFilterCardsMob,
  selectedImage,
  isCard,
}) => {
  const router: any = useRouter()
  const currentNavId = router.query.payment_system
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { t } = useTranslation()
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const onSwich = (item: NavData) => {
    onClick(item?.id)
  }
  return (
    <Section isMedium className={style.wrapper}>
      <Container>
        {!isMobile && isVisible ? (
          <div className={style.grid}>
            {data?.map((item, _index) =>
              item.is_active ? (
                <div
                  onClick={() => onSwich(item)}
                  key={item.id}
                  style={{ background: isCard ? '#f1f5ff' : '' }}
                  className={`
                    ${style.link_2} regular-18
                    ${currentNavId === `${item.id}` ? style.active : ''}
                   `}
                >
                  <AppImage alt="" src={item.image} width={60} height={40} />
                  {item.name}
                  {!item.is_available && (
                    <p className={`${style.badge} bottom-0`}>
                      {t('setting.badge')}
                    </p>
                  )}
                  {item?.is_open === false && (
                    <p className={`${style.badge_small} bottom-0`}>
                      {t('status_card_system')}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        ) : (
          <SelectImg
            isAviable
            onFilterCardsMob={onFilterCardsMob}
            selectedImage={selectedImage}
            optionsList={data}
          />
        )}
      </Container>
    </Section>
  )
}

export default NavigationPrimary
