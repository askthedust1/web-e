import SwiperCore, { A11y, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import CardThird from "components/Cards/CardThird";
import HeadingWithNav from "components/Heading/HeadingWithNav";
import Container from "components/Container";
import Section from "components/Section";
import { FC } from "react"
import style from './carousel-card-third.module.scss'

SwiperCore.use([A11y, Navigation]);

interface Array {
    id: number,
    image?: string,
    title: string,
    link?: string,
    desc: string;
    icon?: string,
}
interface CarouselsCardThird {
    title: string
    data: Array[]
}

const CarouselsCardThird: FC<CarouselsCardThird> = ({ title, data }) => {
    return (
        <Section className={style.section}>
            <Container>
                <HeadingWithNav
                    title={title}
                    arrowPrev="arrow-prev-online-services"
                    arrowNext="arrow-next-online-services"
                />
                <div role="region" aria-roledescription="carousel" aria-label={title}>
                <Swiper
                    rewind
                    a11y={{
                        enabled: true,
                        prevSlideMessage: 'Предыдущий слайд',
                        nextSlideMessage: 'Следующий слайд',
                    }}
                    spaceBetween={20}
                    slidesPerView={4}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        960: {
                            slidesPerView: 2,
                        },
                        1200: {
                            slidesPerView: 4,
                        },
                    }}
                    navigation={{
                        nextEl: ".arrow-next-online-services",
                        prevEl: ".arrow-prev-online-services"
                    }}
                    autoplay={false}
                >
                    {data?.map((item, index) => (
                        <SwiperSlide key={index} role="group" aria-roledescription="slide">
                            <CardThird item={item} />
                        </SwiperSlide>
                    ))}

                </Swiper>
                </div>
            </Container>
        </Section>
    );
};

export default CarouselsCardThird;