import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { EffectFade, Navigation, Pagination } from 'swiper'
import AppImage from 'components/ui/AppImage'
import s from '../stories.module.scss'
import { ArticleCorporateLife } from 'services/api/OtherApimodule'

interface Props {
  articles: ArticleCorporateLife[]
}

SwiperCore.use([EffectFade, Navigation, Pagination])

const CorporateSlider: React.FC<Props> = ({ articles }) => {
  return (
    <div className={s.corporateLife}>
      <Swiper
        spaceBetween={30}
        navigation={true}
        className="mySwiper"
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: false,
            pagination: false,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
        }}
        pagination={{ clickable: true }}
      >
        {articles?.map(({ id, image, title, content }, index) => {
          const isReversed = index % 2 !== 0

          return (
            <SwiperSlide key={id}>
              <div
                className={`${s.sliderCard} ${isReversed ? s.reversed : ''}`}
              >
                <div className={s.left}>
                  <AppImage
                    src={image}
                    alt={title}
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={s.right}>
                  <h3>{title}</h3>
                  <p>{content}</p>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default CorporateSlider
