import React, { FC } from 'react'
import s from './awardCard.module.scss'

interface AwardCardProps {
  title: string,
  subtitle: string,
  bgImage: string,
  bgPosition?: string;
  bgSize?: string;
}

const AwardCard: FC<AwardCardProps> = ({
                                         title,
                                         subtitle,
                                         bgImage,
                                         bgPosition = "right bottom",
                                         bgSize,
                                       }) => {
  const isSpecialCard = bgPosition === "100px 30px";

  return (
    <div
      className={`${s.awardCard} ${isSpecialCard ? s.adjustPosition : ''}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: bgPosition,
        backgroundSize: bgSize,
      }}
    >
      <div className={s.awardTop}>
        <h3 className={s.awardTitle}>{title}</h3>
      </div>
      <div className={s.awardBottom}>
        <p className={s.awardSubtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export default AwardCard