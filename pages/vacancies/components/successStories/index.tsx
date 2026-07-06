import React from 'react';
import s from './successStories.module.scss';
import StoriesCardBig from 'components/Vacancies/StoriesCard/StoriesCardBig'
import StoriesCardSmall from 'components/Vacancies/StoriesCard/StoriesCardSmall'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'
import { useTranslation } from 'next-i18next'

interface NewsItem {
  id: number;
  image: string;
  title: string;
  slug: string;
}

interface Props {
  data: NewsItem[];
}

const SuccessStories: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation()
  const leftLarge = data[0];
  const leftSmalls = data.slice(1, 3);
  const rightSmalls = data.slice(3, 5);
  const rightLarge = data[5];

  return (
    <section className={s.successSection}>
      <GradientBlob
        background="linear-gradient(358deg, rgba(8,126,229,0.8) 25%, rgba(95,222,197,0.77) 71%)"
        size={500}
        top="70vh"
        left="-25vh"
        blur={150}
        zIndex={-1}
      />

      <GradientBlob
        background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
        size={400}
        top="20vh"
        right="10vh"
        blur={150}
        zIndex={-1}
      />
      <h2 className={s.title}>{t('job.stories')}</h2>
      <div className={s.newsGrid}>
        <div className={s.column}>
          {leftLarge && <StoriesCardBig image={leftLarge.image} title={leftLarge.title} slug={leftLarge.slug} />}
          <div className={s.rowCards}>
            {leftSmalls.map((item) => (
              <StoriesCardSmall key={item.id} image={item.image} title={item.title} slug={item.slug} />
            ))}
          </div>
        </div>

        <div className={s.column}>
          <div className={s.rowCards}>
            {rightSmalls.map((item) => (
              <StoriesCardSmall key={item.id} image={item.image} title={item.title} slug={item.slug} />
            ))}
          </div>
          {rightLarge && <StoriesCardBig image={rightLarge.image} title={rightLarge.title} slug={rightLarge.slug} />}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
