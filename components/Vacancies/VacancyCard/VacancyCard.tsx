import React, { FC } from 'react';
import clsx from 'clsx';
import s from '../../../pages/vacancies/components/vacancies/vacancyBlock.module.scss';
import Icon from 'components/Icon'
import { useRouter } from 'next/router'

interface Props {
  id: number;
  title: string;
  location: {
    id: number
    name: string
  }[]
  img: string;
  gradient: string;
  tall?: boolean;
  height?: string;
  slug: string;
}

const VacancyCard: FC<Props> = ({ title, location, img, gradient, tall = false, height, slug }) => {
  const router = useRouter();

  const pathLink = (path: string) => {
    const forWho = router?.query?.for_who
    const query = forWho === 'legal' ? { for_who: 'legal' } : {}

    router.push({
      pathname: path,
      query,
    });
  };
  const locationText = location.map(loc => loc.name).slice(0, 2).join(', ');
  return (
    <div className={s.cardLink} onClick={() => pathLink(`/vacancies/${slug}`)}>
      <div
        className={clsx(s.vacancyCard, tall && s.tallCard)}
        style={{ background: gradient, cursor: 'pointer', height: height, }}
      >
        <div style={{ zIndex: 9999 }}>
          <div className={s.location}> <Icon
            id="location"
            className={s.locationIcon}
            width={20}
            height={20}
          /> {locationText}</div>
          <h3 className={s.titleText}>{title}</h3>
        </div>
        <div
          className={clsx(tall ? s.cardIconTall : s.cardIcon)}
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      </div>
    </div>
  );
};

export default VacancyCard;

