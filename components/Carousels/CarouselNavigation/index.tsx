import Section from 'components/Section'
import Container from 'components/Container'
import Icon from 'components/Icon'
import SwiperCore, { Navigation, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRouter } from 'next/router'
import style from './carousel-navigation.module.scss'
import 'swiper/css'

SwiperCore.use([Navigation, Mousewheel])

interface NavigationItem {
  id: number | string
  title: string
  slug?: string
}
interface CarouselNavigationProps {
  navigation?: Array<NavigationItem>
  onClick(index: number | string, itemIndex?: number): void
  activeTab?: string | number | string[]
}

const CarouselNavigation = ({
  navigation,
  onClick,
  activeTab,
}: CarouselNavigationProps) => {
  const _router = useRouter()

  if (navigation?.length === 0) {
    return null
  }

  return (
    <Section isMedium className={style.wrapper}>
      <Container>
        <div className={`${style.arrow} arrow-prev-navigation`}>
          <Icon id="arrow-left" width={18} height={18} className={style.icon} />
        </div>
        <div className={`${style.arrow} arrow-next-navigation`}>
          <Icon
            id="arrow-right"
            width={18}
            height={18}
            className={style.icon}
          />
        </div>
        <Swiper
          spaceBetween={0}
          slidesPerView="auto"
          mousewheel
          navigation={{
            nextEl: '.arrow-next-navigation',
            prevEl: '.arrow-prev-navigation',
          }}
        >
          {navigation?.map((item, index) => (
            <SwiperSlide key={item?.id}>
              <p
                onClick={() => onClick(item.id, index)}
                className={`
                                        regular-18
                                        ${style.link} 
                                        ${
                                          String(activeTab) ===
                                          `${String(item?.id)}`
                                            ? style.active
                                            : ''
                                        }
                                    `}
              >
                {item?.title}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Section>
  )
}

export default CarouselNavigation
