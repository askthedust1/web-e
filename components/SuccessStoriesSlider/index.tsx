import React, { FC, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import styles from './success-stories-slider.module.scss'
import parse from 'html-react-parser'
import Link from 'next/link'
import AppImage from 'components/ui/AppImage'
import { useTranslation } from 'next-i18next'

interface SuccessStoriesSlider {
  data: {
    id: number
    image: string
    title: string
    description: string
    slug: string
  }[]
  title: string
}
const SuccessStoriesSlider: FC<SuccessStoriesSlider> = ({ data, title }) => {
  const { t } = useTranslation()

  const swiperRef = useRef<any>(null)
  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current?.swiper.slideNext()
    }
  }
  const handleBackSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current?.swiper.slidePrev()
    }
  }
  return (
    <div className="container" style={{ marginTop: 40 }}>
      <div className={styles.slider_list_btn}>
        <h2>{title}</h2>
        <div>
          <button onClick={handleBackSlide}>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13L1 7L7 1"
                stroke="#0F4F8D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={handleNextSlide}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#0F4F8D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <Swiper navigation ref={swiperRef} spaceBetween={30} slidesPerView={1}>
        {data.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <div className={styles.slider_list}>
                <div>
                  <AppImage
                    src={item.image || '/default'}
                    alt="Employee"
                    width={592}
                    height={352}
                    style={{
                      borderRadius: 8,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      width: '592px',
                      height: '352px',
                    }}
                  />
                </div>
                <div className={styles.slider_list_text}>
                  <h2>{item.title}</h2>
                  <div>{parse(item.description?.slice(0, 300))}</div>
                  <Link href={`/hr-page/${item.slug}`}>
                    {t('setting.button_more')}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default SuccessStoriesSlider
