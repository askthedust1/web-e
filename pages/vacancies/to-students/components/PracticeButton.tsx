import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import s from '../toStudents.module.scss';
import { useTranslation } from 'next-i18next'

const PracticeButton = ({ handleOpenPopUp }: any) => {
  const { t } = useTranslation()

  const images = [
    '/images/vacancies/bird.png',
    '/images/vacancies/bird2.png',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={s.practiceBtn}>
      <div className={s.imgPractice}>
        <Image
          src={images[currentIndex]}
          width={300}
          height={400}
          alt="Photo"
        />
      </div>
      <button
        className={s.ctaNeo}
        onClick={() => handleOpenPopUp('practice')}
      >
        <span>{t('job.students.cta_practice')}</span>
      </button>
    </div>
  );
};

export default PracticeButton;
