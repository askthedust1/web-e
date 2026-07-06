import SwiperCore, { A11y, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import CardMain from 'components/Cards/CardMain'
import HeadingWithNav from 'components/Heading/HeadingWithNav'
import Container from 'components/Container'
import Section from 'components/Section'

import style from './carousel-card-main.module.scss'
import { FC } from 'react'

SwiperCore.use([A11y, Navigation])

interface Array {
  badge?: string
  id: number
  image: string
  title: string
  tag: string
  desc: string
  link: string
}

interface CarouselCardMain {
  title: string
  data?: Array[]
  buttonText?: string
}

const CarouselCardMain: FC<CarouselCardMain> = ({
  title,
  data,
  buttonText,
}: CarouselCardMain) => {
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
          autoplay={false}
        >
          {data &&
            data.map((item) => (
              <SwiperSlide key={item?.id} role="group" aria-roledescription="slide">
                <CardMain
                  href={item.link}
                  item={item}
                  imageWidth={280}
                  imageHeight={200}
                  buttonText={buttonText}
                />
              </SwiperSlide>
            ))}
        </Swiper>
        </div>
      </Container>
    </Section>
  )
}

export default CarouselCardMain
