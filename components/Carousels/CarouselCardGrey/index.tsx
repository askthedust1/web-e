import SwiperCore, { A11y, Autoplay, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import HeadingWithNav from 'components/Heading/HeadingWithNav'
import Container from 'components/Container'
import Section from 'components/Section'

import style from './carousel-card-gray.module.scss'
import { FC } from 'react'
import CarGray from 'components/Cards/CardGray'

SwiperCore.use([A11y, Navigation, Autoplay])

interface Array {
  id: number
  slug: string
  name: string
  short_desc: string
  image: string
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

interface CarouselCardGreyProps {
  title: string
  data?: Array[]
  path: string
}

const CarouselCardGrey: FC<CarouselCardGreyProps> = ({
  title,
  data,
  path,
}: CarouselCardGreyProps) => {
  return (
    <Section className={style.section}>
      <Container>
        <HeadingWithNav
          title={title}
          arrowPrev="arrow-prev-card-main"
          arrowNext="arrow-next-card-main"
        />
        <div role="region" aria-roledescription="carousel" aria-label={title}>
        <Swiper
          rewind
          a11y={{
            enabled: true,
            prevSlideMessage: 'Предыдущий слайд',
            nextSlideMessage: 'Следующий слайд',
          }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          navigation={{
            nextEl: '.arrow-next-card-main',
            prevEl: '.arrow-prev-card-main',
          }}
          autoplay={{
            delay: 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
        >
          {data?.map((item) => (
            <SwiperSlide key={item?.id} role="group" aria-roledescription="slide">
              <CarGray href={path + item.slug} item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </Container>
    </Section>
  )
}

export default CarouselCardGrey
