import { useState, useEffect, useRef, FC } from 'react'
import SwiperCore, { A11y, Autoplay, Navigation, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Container from 'components/Container'
import Image from 'next/image'
import Link from 'next/link'
import s from './home-slider-main.module.scss'
import parse from 'html-react-parser'
import clsx from 'clsx'
import notFund from 'public/images/no-photo.jpg'

SwiperCore.use([A11y, Navigation, Autoplay])

const decodeMediaUrl = (url: string) => {
  try {
    return decodeURIComponent(url)
  } catch {
    return url
  }
}

interface BannerItem {
  banner_button_link: string
  banner_button_text?: string
  banner_image?: string
  banner_image_mob?: string
  banner_subtitle: string
  banner_subtitle_hex: string
  banner_title_hex: string
  banner_title?: string
  tag?: string
  title?: string
  id?: number
}

interface HomeSlider {
  data: BannerItem[]
}

const buildCutDesc = (subtitle?: string) => {
  if (!subtitle) return ''
  const shortcut = subtitle.length > 230 ? '...' : ''
  return subtitle.slice(0, 230) + shortcut
}

// ── Shared slide content (title / desc / button) ──────────────────────────────
const SlideContent: FC<{ item: BannerItem }> = ({ item }) => {
  const cut_desc = buildCutDesc(item.banner_subtitle)
  return (
    <Container>
      <div className={s.text}>
        {item.banner_title && (
          <h2
            style={{ color: item?.banner_title_hex }}
            className={clsx(s.title, 'medium-40')}
          >
            {item?.banner_title && item?.banner_subtitle}
          </h2>
        )}
        {cut_desc && (
          <div
            style={{ color: item?.banner_subtitle_hex }}
            className={clsx(s.desc, 'light-18')}
          >
            {parse(cut_desc)}
          </div>
        )}
        {item?.banner_button_link && (
          <Link legacyBehavior href={item.banner_button_link}>
            <a className={clsx(s.link, 'light-14')}>
              {item.banner_button_text}
            </a>
          </Link>
        )}
      </div>
    </Container>
  )
}

const MobileSlider: FC<{ data: BannerItem[] }> = ({ data }) => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slides = Array.from(track.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slides.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { root: track, threshold: 0.6 }
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [data])

  const goTo = (idx: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[idx] as HTMLElement | undefined
    slide?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    })
  }

  return (
    <div className={s.mobileCarousel}>
      <div className={s.mobileTrack} ref={trackRef}>
        {data?.map((item, index) => {
          const rawImage = item?.banner_image_mob || item?.banner_image
          const image =
            typeof rawImage === 'string' ? decodeMediaUrl(rawImage) : rawImage
          return (
            <div
              className={s.mobileSlide}
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} из ${data.length}`}
            >
              <div className={clsx(s.slide)}>
                <Image
                  alt={item.banner_title || ''}
                  className={clsx(s.slide)}
                  src={typeof image === 'string' ? image : notFund}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  sizes="100vw"
                  priority={index === 0}
                />
                <SlideContent item={item} />
              </div>
            </div>
          )
        })}
      </div>

      {data?.length > 1 && (
        <div
          className={s.mobileDots}
          role="tablist"
          aria-label="Навигация по баннерам"
        >
          {data.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Перейти к баннеру ${index + 1}`}
              className={clsx(
                s.mobileDot,
                activeIndex === index && s.mobileDotActive
              )}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Desktop: existing Swiper with thumbs ──────────────────────────────────────
const DesktopSlider: FC<{ data: BannerItem[] }> = ({ data }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null)
  const [stateIndex, setSwiperIndex] = useState<number>(0)

  return (
    <>
      <Swiper
        className={s.main__slider}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[A11y, Navigation, Thumbs]}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Предыдущий слайд',
          nextSlideMessage: 'Следующий слайд',
        }}
        spaceBetween={10}
        speed={300}
        loop={false}
        navigation
        rewind
        simulateTouch
        grabCursor
        touchStartPreventDefault={false}
        autoplay={{
          delay: 10000,
          pauseOnMouseEnter: false,
          disableOnInteraction: false,
        }}
        onSlideChange={(e) => setSwiperIndex(e.realIndex)}
      >
        {data?.map((item, index) => {
          const rawImage = item?.banner_image
          const image =
            typeof rawImage === 'string' ? decodeMediaUrl(rawImage) : rawImage
          return (
            <SwiperSlide
              key={item.id}
              role="group"
              aria-roledescription="slide"
            >
              <div className={clsx(s.slide)}>
                <Image
                  alt={item.banner_title || ''}
                  className={clsx(s.slide)}
                  src={typeof image === 'string' ? image : notFund}
                  fill
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  sizes="100vw"
                  priority={index === 0}
                />
                <SlideContent item={item} />
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className={s.thumb}>
        <Container>
          <Swiper
            modules={[Thumbs]}
            className={s.thumb__slider}
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            direction={'horizontal'}
            spaceBetween={0}
            slidesPerView={4}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1200: { slidesPerView: 4 },
            }}
            loop={false}
            rewind
            autoplay={{
              delay: 10000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
          >
            <div className={s.border}>
              {data?.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <div
                    className={clsx(
                      s.smallSlide,
                      stateIndex === index && s.active
                    )}
                  >
                    <div className={clsx(s.tag, 'light-14')}>{item.tag}</div>
                    <h2 className={clsx(s.smallTitle, 'light-18')}>
                      {item.title}
                    </h2>
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </Container>
      </div>
    </>
  )
}

const HomeSlider: FC<HomeSlider> = ({ data }: HomeSlider) => {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div
      className={s.mainSlider}
      role="region"
      aria-roledescription="carousel"
      aria-label="Баннер"
    >
      {mounted && isMobile ? (
        <MobileSlider data={data} />
      ) : (
        <DesktopSlider data={data} />
      )}
    </div>
  )
}

export default HomeSlider
