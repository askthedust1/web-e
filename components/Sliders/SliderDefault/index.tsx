import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
    A11y,
    Autoplay,
    Controller,
    Pagination,
    Navigation,
    Mousewheel,
} from 'swiper';

import clsx from 'clsx';
import Image from 'next/image';
import 'swiper/css';
import s from './slider-default.module.scss';
import Icon from 'components/Icon';

SwiperCore.use([Navigation, Mousewheel]);
interface Props {
    className?: string;
    width?: number;
    height?: number;
    banners: {
        id: number;
        image: string;
        text?: string;
        is_app_link?: boolean;
    }[];
}

const defaulBannertWidth = 768;
const defaulBannertHeight = 374;
export const CbkBannerDefault = ({
    className,
    width: _width = defaulBannertWidth,
    height: _height = defaulBannertHeight,
    banners,
}: Props) => {
    const [_swiper, setSwiper] = useState<number>(0);

    if (!banners?.length) {
        return null;
    }
    return (
        <div className={s.container} role="region" aria-roledescription="carousel" aria-label="Баннер">
            <div className={clsx(s.arrow, 'arrow-prev-navigation')}>
                <Icon id="arrow-left" width={30} height={30} />
            </div>
            <div className={clsx(s.arrow, 'arrow-next-navigation')}>
                <Icon id="arrow-right" width={30} height={30} />
            </div>

            <Swiper
                modules={[A11y, Controller, Autoplay, Pagination]}
                a11y={{
                    enabled: true,
                    prevSlideMessage: 'Предыдущий слайд',
                    nextSlideMessage: 'Следующий слайд',
                }}
                className={clsx(s.carousel, className)}
                onSlideChange={(e) => setSwiper(e.realIndex)}
                loop
                spaceBetween={14}
                slidesPerView={1}
                navigation={{
                    nextEl: '.arrow-next-navigation',
                    prevEl: '.arrow-prev-navigation',
                }}
            >
                {banners?.map((item) => (
                    <SwiperSlide key={item?.id} role="group" aria-roledescription="slide">
                        <div className={s.bannerItem}>
                            <Image
                                fill
                                src={item?.image || '/'}
                                className={s.image}
                                alt="banner image"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
};
