import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { A11y, Navigation } from "swiper";
import "swiper/css";
import CardSecondary from "components/Cards/CardSecondary";
import HeadingWithNav from "components/Heading/HeadingWithNav";
import Section from "components/Section";
import Container from "components/Container";
SwiperCore.use([A11y, Navigation]);
import style from "./carousel-news-promotions.module.scss";

interface CaruselData {
  id: number;
  image?: string;
  title: string;

  published_at?
  : string;
  created_at?
  : string;
  desc?: string;
  link?: string;
  slug?: string;
  short_decs?: string;
  min_pay?: string;
  price?: string;
  main_image?: {
    id: number;
    image: string;
    is_main: boolean;
  };
}

interface CarouselNewsPromotionsProps {
  title?: string;
  data: CaruselData[];
  isProperty?: boolean;
  pathname?: string;
}

const CarouselNewsPromotions: FC<CarouselNewsPromotionsProps> = ({
  title,
  data,
  isProperty = false,
  pathname,
}: CarouselNewsPromotionsProps) => {
  return (
    <Section className={style.section}>
      <Container>
        <HeadingWithNav
          title={title}
          link={pathname}
          arrowPrev="arrow-prev-news"
          arrowNext="arrow-next-news"
        />
        <div role="region" aria-roledescription="carousel" aria-label={title}>
        <Swiper
          className={style.carousel}
          a11y={{
            enabled: true,
            prevSlideMessage: 'Предыдущий слайд',
            nextSlideMessage: 'Следующий слайд',
          }}
          navigation={{
            nextEl: ".arrow-next-news",
            prevEl: ".arrow-prev-news",
          }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            960: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          autoplay={false}
          rewind
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index} role="group" aria-roledescription="slide">
              <CardSecondary
                isProperty={isProperty}
                href={{
                  pathname: `${pathname}/[slug]`,
                  query: { slug: item.slug || "/" },
                }}
                imageWidth={380}
                imageHeight={200}
                item={item}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </Container>
    </Section>
  );
};

export default CarouselNewsPromotions;
