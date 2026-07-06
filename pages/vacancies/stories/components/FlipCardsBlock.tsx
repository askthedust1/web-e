import React from 'react';
import { StaticImageData } from 'next/image'
import s from '../stories.module.scss';

interface CardProps {
  front: string;
  back: string;
  image: StaticImageData;
}

const FlipCardsBlock: React.FC<{ cards: CardProps[] }> = ({ cards }) => (
  <div className={s.cardsWrapper}>
    {cards.map(({ front, back, image }, idx) => (
      <div className={s.flipCard} key={idx}>
        <div className={s.flipCardInner}>
          <div className={s.flipCardFront} style={{ backgroundImage: `url(${image.src})` }}>
            <span>{front}</span>
          </div>
          <div className={s.flipCardBack}>{back}</div>
        </div>
      </div>
    ))}
  </div>
);

export default FlipCardsBlock;