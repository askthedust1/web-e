import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import { useState } from 'react'
import s from '../property.module.scss'
import clsx from 'clsx'
import CarouselNewsPromotions from 'components/Carousels/CarouselNewsPromotions'
import { GetServerSideProps, NextPage } from 'next'
import SwiperCore, { Autoplay, Navigation, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useMediaQuery } from 'react-responsive'
import { getTranslations } from 'helpers/serverTranslations'
import { PropertyApi } from 'services/api/PropertyApi'
import { PropertyDeteiltProps } from 'services/api/PropertyApiModule'
import Section from 'components/Section'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import { useTranslation } from 'next-i18next'
import CkEditor from 'components/CkEditor'
SwiperCore.use([Navigation, Autoplay])
interface Props {
  data: PropertyDeteiltProps
}
const NewsDeteil: NextPage<Props> = ({ data }) => {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null)
  const [active, setActive] = useState<any | null>(0)
  const { t } = useTranslation()

  return (
    <>
      <Section className={s.section}>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t('pages_names.property'),
              link: '/property',
            }}
            slug={{
              title: data?.title,
              link: data.slug,
            }}
          />
        </Container>
        <Container>
          <div className={s.newsWrapper}>
            <h1 className={clsx(s.title, 'medium-40')}>{data?.title}</h1>

            <Swiper
              className={s.swiper}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              spaceBetween={10}
              speed={300}
              loop={false}
              navigation
              rewind
              autoplay={{
                delay: 3000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
              }}
            >
              <div className={s.price}>
                <div className={s.block}>
                  <p className={clsx(s.key, 'light-12')}>
                    {t('price_property')}
                  </p>
                  <p className={clsx(s.value, 'medium-18')}>{data.price}</p>
                </div>
                <div className={s.block}>
                  <p className={clsx(s.key, 'light-12')}>
                    {t('minimal_property')}
                  </p>
                  <p className={clsx(s.value, 'medium-18')}>{data.min_pay}</p>
                </div>
              </div>
              {data.images.map((item) => (
                <SwiperSlide key={item.id}>
                  <AppImage
                    alt={`${item?.id}`}
                    src={item?.image || '/'}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={s.carousel}>
              <Container>
                <Swiper
                  modules={[Thumbs]}
                  className={s.thumb__slider}
                  onSwiper={(swiper) => setThumbsSwiper(swiper)}
                  direction={'horizontal'}
                  spaceBetween={10}
                  slidesPerView={10}
                  breakpoints={{
                    0: {
                      slidesPerView: 3,
                    },
                    500: {
                      slidesPerView: 5,
                    },
                    640: {
                      slidesPerView: 7,
                    },
                    1200: {
                      slidesPerView: 10,
                    },
                  }}
                  loop={false}
                  rewind
                  autoplay={{
                    delay: 3000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
                  }}
                >
                  {data.images.map((item, index) => (
                    <SwiperSlide key={item.id}>
                      <div
                        className={s.images}
                        onClick={() => setActive(index)}
                      >
                        <AppImage
                          alt={`${item.id}`}
                          key={item.id}
                          src={item?.image || '/'}
                          className={clsx(
                            s.imgWrapperThump,
                            index !== active && s.noactive
                          )}
                          height={!isMobile ? 90 : 60}
                          width={!isMobile ? 90 : 60}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Container>
            </div>
            <div className={clsx(s.subtitle, 'regular-20')}>
              <div className={s.priceMob}>
                <div className={s.block}>
                  <p className={clsx(s.key, 'light-12')}>
                    {t('price_property')}
                  </p>
                  <p className={clsx(s.value, 'medium-18')}>{data.price}</p>
                </div>
                <div className={s.block}>
                  <p className={clsx(s.key, 'light-12')}>
                    {t('minimal_property')}
                  </p>
                  <p className={clsx(s.value, 'medium-18')}>{data.min_pay}</p>
                </div>
              </div>
              <CkEditor description={data.desc} />
            </div>
          </div>
          <CarouselNewsPromotions
            pathname="/property"
            isProperty
            data={data.other_ownerships}
            title={t('pages_names.property')}
          />
        </Container>
      </Section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  locale,
}) => {
  const { data } = await PropertyApi.getNewsDeteil(
    params?.slug as string,
    locale || 'ru'
  )
  return {
    props: {
      data,
      ...(await getTranslations(locale as string)),
    },
  }
}

export default NewsDeteil
