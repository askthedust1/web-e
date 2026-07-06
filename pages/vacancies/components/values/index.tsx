import React, { useRef } from 'react'
import ValueCard from 'components/Vacancies/ValueCard/ValueCard'
import s from '/components/Vacancies/ValueCard/value.module.scss'
import value1 from '/public/images/vacancies/value1.png'
import value2 from '/public/images/vacancies/value2.png'
import value3 from '/public/images/vacancies/value3.png'
import value4 from '/public/images/vacancies/value4.png'
import value5 from '/public/images/vacancies/value5.png'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'
import { useTranslation } from 'next-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

SwiperCore.use([Navigation, Autoplay])

const Values = () => {
  const { t } = useTranslation()
  const swiperRef = useRef<SwiperCore>()

  const values = [
    {
      title: t("job.values.trust.title"),
      description: t("job.values.trust.description"),
      image: value1,
    },
    {
      title: t("job.values.team.title"),
      description: t("job.values.team.description"),
      image: value2,
    },
    {
      title: t("job.values.care.title"),
      description: t("job.values.care.description"),
      image: value4,
    },
    {
      title: t("job.values.growth.title"),
      description: t("job.values.growth.description"),
      image: value5,
    },
    {
      title: t("job.values.five.title"),
      description: t("job.values.five.description"),
      image: value3,
    },
  ]

  return (
    <div className={s.valuesContainer}>
      <GradientBlob
        background="linear-gradient(358deg, #75EA1C 0%, #27FFB3 100%)"
        size={300}
        top="-15vw"
        left="20vw"
        blur={200}
        zIndex={-1}
      />

      <h2 className={s.valuesHeader}>{t("job.values.value")}</h2>

      <div className={s.sliderWrapper}>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          navigation={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
        >
          {values.map((item, idx) => (
            <SwiperSlide
              key={idx}
              onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
              onMouseLeave={() => swiperRef.current?.autoplay?.start()}
            >
              <ValueCard
                title={item.title}
                description={item.description}
                image={item.image}
                className={idx === 0 ? 'highlighted' : undefined}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Values
