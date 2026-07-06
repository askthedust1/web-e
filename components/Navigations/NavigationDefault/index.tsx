import Container from 'components/Container'
import Section from 'components/Section'
import SelectImg from 'components/Select/SelectImage'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import style from '../navigation.module.scss'
import { useTranslation } from 'next-i18next'

interface Array {
  id: number
  image: string
  is_available?: boolean
  name?: string
}

interface NavigationDefaultProps {
  data: Array[]
  onClick(category: number | string): void
  onFilterCardsMob(e: string | number): void
  selectedImage: string
}

const NavigationDefault: FC<NavigationDefaultProps> = ({
  data,
  onClick,
  selectedImage,
  onFilterCardsMob,
}) => {
  const router: any = useRouter()
  const currentNavId = parseInt(router.query.category)
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  return (
    <Section isMedium className={style.wrapper}>
      <Container>
        {!isMobile && isVisible ? (
          <div className={style.grid_def}>
            <p
              className={`
                             ${style.link} 
                             ${!currentNavId ? style.active : ''}
                         `}
              onClick={() => onClick('')}
            >
              {t('setting.all')}
            </p>
            {data.map((item, index) => (
              <p
                className={`
                             ${style.link} 
                             ${currentNavId === item.id ? style.active : ' '}
                         `}
                key={index}
                onClick={() => onClick(item?.id)}
              >
                {item.name}
              </p>
            ))}
          </div>
        ) : (
          <SelectImg
            onFilterCardsMob={onFilterCardsMob}
            optionsList={data}
            selectedImage={selectedImage}
          />
        )}
      </Container>
    </Section>
  )
}

export default NavigationDefault
