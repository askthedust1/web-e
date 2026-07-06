import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Pagination } from 'swiper'
import AppImage from 'components/ui/AppImage'
import { Swiper as SwiperClass } from 'swiper/types'
import s from '../stories.module.scss'
import { PhotoCorporateLife } from 'services/api/OtherApimodule'

interface Props {
  photos: PhotoCorporateLife[]
}

SwiperCore.use([Autoplay, Pagination])

const PhotoSlider: React.FC<Props> = ({ photos }) => {
  const swiperRef = useRef<SwiperClass | null>(null)

  return (
    <div
      className={s.photoSlider}
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop
        speed={5000}
        autoplay={{ delay: 0, disableOnInteraction: true }}
        pagination={{ clickable: true }}
        slidesPerView="auto"
        spaceBetween={30}
        allowTouchMove
        className="photoSwiper"
      >
        {photos?.map(({ id, image, caption }: any) => (
          <SwiperSlide key={id} className={s.photoSlide}>
            <div className={s.photoWrapper}>
              <AppImage
                src={image}
                alt={caption}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className={s.photoImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default PhotoSlider
