import React from 'react'
import s from '../../../../components/Vacancies/AwardsCard/awardCard.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import AwardCard from 'components/Vacancies/AwardsCard/AwardCard'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'
import { useTranslation } from 'next-i18next'

const EmployerAwards = () => {
  const { t } = useTranslation()

  const awards = [
    {
      title: t("job.awards.best_employer.title"),
      subtitle: t("job.awards.best_employer.subtitle"),
      bgImage: "/images/vacancies/4.gif",
      bgPosition: "100px 30px",
      bgSize: "contain"
    },
    {
      title: t("job.awards.best_ecosystem.title"),
      subtitle: t("job.awards.best_ecosystem.subtitle"),
      bgImage: "/images/vacancies/1.png",
    },
    {
      title: t("job.awards.top1_bank.title"),
      subtitle: t("job.awards.top1_bank.subtitle"),
      bgImage: "/images/vacancies/2.png",
    },
    {
      title: t("job.awards.fastest_growth.title"),
      subtitle: t("job.awards.fastest_growth.subtitle"),
      bgImage: "/images/vacancies/star.gif",
      bgSize: "170px"
    }
  ]

  return (
    <div className={s.awardsContainer}>

      <GradientBlob
        background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
        size={200}
        top="10vh"
        right="20vh"
        blur={150}
        zIndex={-99}
      />
      <div className={s.awardsGrid}>
        {awards.map((award, index) => (
          <AwardCard key={index} {...award} />
        ))}
      </div>

      <div className={s.mobileSwiper}>
        <Swiper
          spaceBetween={16}
          slidesPerView={1.1}
        >
          {awards.map((award, index) => (
            <SwiperSlide key={index}>
              <AwardCard {...award} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default EmployerAwards
