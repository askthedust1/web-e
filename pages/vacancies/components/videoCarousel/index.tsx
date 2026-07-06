import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './videoCarousel.module.scss';
import { Navigation } from 'swiper';
import { VideoItem } from 'services/api/OtherApimodule'
interface VideoCarouselProps {
  videos: VideoItem[];
}

const getYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
};

const VideoSlide: React.FC<{ video: VideoItem }> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeId = getYoutubeId(video.url);

  if (!youtubeId) return null;

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoFrameWrapper}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className={styles.thumbnail}
            style={{ backgroundImage: `url(/images/vacancies/video-bg.png)` }}
            onClick={() => setIsPlaying(true)}
          >
            <div className={styles.playButton} />
          </div>
        )}
      </div>
      <h3 className={styles.title}>{video.title}</h3>
      {video.description && <p className={styles.description}>{video.description}</p>}
    </div>
  );
};

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  return (
    <div className={styles.carouselWrapper}>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={24}
        slidesPerView={1}
        className={styles.swiper}
      >
        {videos?.map((video) => (
          <SwiperSlide key={video.id} className={styles.slide}>
            <VideoSlide video={video} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCarousel;

