import React, { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import clsx from "clsx";
import s from "./vacancyBlock.module.scss";
import VacancyCard from 'components/Vacancies/VacancyCard/VacancyCard';
import { VacanciesProps } from 'services/api/InfoApiModule';
import { InfoApi } from 'services/api/InfoApi';
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob';
import Loader from 'components/Loader';
import { useTranslation } from 'next-i18next'
import { Scrollbar } from 'swiper'
import "swiper/css/scrollbar";
import NoVacancies from 'components/Vacancies/NoVacancies'

interface Props {
  data: VacanciesProps[];
  departments: { id: number; name: string; slug: string }[];
}

const gradients = [
  "linear-gradient(115deg, rgba(34, 117, 152, 1) 0%, rgba(104, 209, 209, 1) 100%)",
  "linear-gradient(115deg, rgba(76, 82, 191, 1) 0%, rgba(38, 217, 223, 1) 100%)",
  "#2B79EE",
  "linear-gradient(115deg, rgba(120, 71, 180, 1) 0%, rgba(31, 39, 199, 1) 100%)",
  "linear-gradient(115deg, rgba(146, 185, 242, 1) 0%, rgba(210, 255, 213, 1) 100%)"
];

export const getCardGradient = (index: number) => gradients[index % gradients.length];

const VacancyBlock: FC<Props> = ({ data, departments }) => {
  const { t } = useTranslation()
  const router = useRouter();
  const locale = router.locale || 'ru';

  const [activeId, setActiveId] = useState(0);
  const [vacancies, setVacancies] = useState(data);
  const [loading, setLoading] = useState(false);

  const tabs = useMemo(() => [
    { label: t('job.last'), slug: "", id: 0 },
    ...departments.map(dep => ({ label: dep.name, slug: dep.slug, id: dep.id }))
  ], [departments, t]);

  const handleTabClick = (id: number) => setActiveId(id);

  const goToAllVacancies = () => {
    const query = router.query.for_who === 'legal' ? { for_who: 'legal' } : {};

    router.push({ pathname: "/vacancies/job-list", query });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (activeId === 0) {
        setVacancies(data);
        return;
      }

      setLoading(true);
      try {
        const response = await InfoApi.getPageClient(
          'vacancies',
          locale,
          '',
          '',
          activeId.toString(),
          '',
          { page: 1, page_size: 9 }
        );
        setVacancies(response?.data?.results || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeId, locale, data]);

  const renderSlides = () => {
    if (!vacancies.length) return [];

    const result: React.ReactNode[] = [];

    result.push(
      <SwiperSlide key="pair-0" className={s.swiperSlide}>
        <div className={s.cardColumn}>
          {vacancies.slice(0, 2)?.map((vacancy, idx) => (
            <VacancyCard
              key={vacancy.id}
              id={vacancy.id}
              slug={vacancy.slug}
              title={vacancy.title}
              location={vacancy.cities}
              img={vacancy?.icon?.url}
              gradient={getCardGradient(idx)}
            />
          ))}
        </div>
      </SwiperSlide>
    );

    if (vacancies[2]) {
      result.push(
        <SwiperSlide key="single-2" className={clsx(s.swiperSlide, s.tallSlide)}>
          <VacancyCard
            location={vacancies[2].cities}
            key={vacancies[2].id}
            id={vacancies[2].id}
            slug={vacancies[2].slug}
            title={vacancies[2].title}
            img={vacancies[2]?.icon?.url}
            gradient={getCardGradient(2)}
            tall
          />
        </SwiperSlide>
      );
    }

    for (let i = 3; i < vacancies.length; i += 2) {
      const pair = vacancies.slice(i, i + 2);
      result.push(
        <SwiperSlide key={`pair-${i}`} className={s.swiperSlide}>
          <div className={s.cardColumn}>
            {pair.map((vacancy, j) => (
              <VacancyCard
                key={vacancy.id}
                id={vacancy.id}
                slug={vacancy.slug}
                title={vacancy.title}
                location={vacancy.cities}
                img={vacancy?.icon?.url}
                gradient={getCardGradient(i + j)}
              />
            ))}
          </div>
        </SwiperSlide>
      );
    }

    return result;
  };

  return (
    <section className={s.vacancyBlock}>
      <GradientBlob
        background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
        size={400}
        top="10vh"
        right="30vh"
        blur={150}
        zIndex={-1}
      />

      <div className={s.header}>
        <h2 className={s.title}>{t("job.vacancies_text")}</h2>
        <div onClick={goToAllVacancies} className={s.mobileMore}>
          <a className={s.moreBtn} href="/vacancies/job-list">{t('job.all')} 🠖</a>
        </div>
      </div>

      <div className={s.vacancyHeader}>
        <div className={s.tabsWrapper}>
          <div className={s.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={clsx(s.tabButton, activeId === tab.id && s.active)}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div onClick={goToAllVacancies}>
          <div className={s.moreBtn}>{t('job.all')} 🠖</div>
        </div>
      </div>

      <div className={s.swiperWrapper}>
        {loading ? (
          <Loader />
        ) : vacancies.length === 0 ? (
          <NoVacancies />
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 2.1 }
            }}
            modules={[Scrollbar]}
            scrollbar={{ draggable: true }}
            className={s.swiperFree}
          >
            {renderSlides()}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default VacancyBlock;


