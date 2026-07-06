import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from '../toStudents.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { OtherPageApi } from 'services/api/OtherApi';
import { useRouter } from 'next/router';
import Modal from 'components/ui/Modal'
import FormJob from 'components/ui/FormJob'
import Loader from 'components/Loader'
import InternshipDetailModal from 'pages/vacancies/to-students/components/InternshipDetailModal'
import NoVacancies from 'components/Vacancies/NoVacancies'

interface Vacancy {
  id: number;
  slug: string;
  title: string;
  image: string;
  cities: { id: number; name: string }[];
  direction: { id: number; name: string; slug: string };
  desc?: string;
  reqs?: string;
}

interface Props {
  vacancies: Vacancy[];
  departments: { id: number; name: string; slug: string }[];
}

const InternshipCards: React.FC<Props> = ({ vacancies, departments }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale || 'ru';

  const [activeVacancy, setActiveVacancy] = useState<Vacancy | null>(null);
  const [resumeVacancy, setResumeVacancy] = useState<Vacancy | null>(null);
  const [activeId, setActiveId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalLoading, _setModalLoading] = useState(false);
  const [vacanciesData, setVacanciesData] = useState(vacancies);

  const handleTabClick = (id: number) => setActiveId(id);

  useEffect(() => {
    const fetchData = async () => {
      if (activeId === 0) {
        setVacanciesData(vacancies);
        return;
      }

      setLoading(true);
      try {
        const response = await OtherPageApi.getInternshipsClient(locale, {
          page: 1,
          page_size: 9,
          direction: activeId !== 0 ? activeId.toString() : undefined,
        });
        setVacanciesData(response?.data?.results || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeId, locale, vacancies]);

  const openModal = async (slug: string) => {
    const selectedVacancy = vacancies.find((vacancy) => vacancy.slug === slug);
    if (selectedVacancy) {
      setActiveVacancy(selectedVacancy);
    }
  };

  const openSubmitResume = (vacancy: Vacancy) => {
    setResumeVacancy(vacancy);
  }

  const closeModal = () => setActiveVacancy(null);
  const closeResumeModal = () => setResumeVacancy(null);

  const tabs = useMemo(
    () => [
      { label: t('job.students.last'), slug: '', id: 0 },
      ...departments.map((dep) => ({
        label: dep.name,
        slug: dep.slug,
        id: dep.id,
      })),
    ],
    [departments, t]
  );

  return (
    <div className={styles.internshipSwiper} style={{ width: '100%' }}>
      <div className={styles.vacancyHeader} style={{ margin: '40px 0' }}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={clsx(styles.tabButton, activeId === tab.id && styles.active)}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : vacanciesData.length === 0 ? (
        <NoVacancies />
      ) : (
        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}

          breakpoints={{
            768: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
          }}
          draggable={true}
          className={styles.swiperFreeCarousel}
        >
          {vacanciesData.map((vacancy) => (
            <SwiperSlide key={vacancy.id}>
              <div
                className={styles.card}
                style={{ backgroundImage: `url(${vacancy.image})` }}
              >
                <div className={styles.headerCard}>
                  <h3>{vacancy.title}</h3>
                  <button
                    className={styles.infoBtn}
                    onClick={() => openModal(vacancy.slug)}
                  >
                    i
                  </button>
                </div>
                <div className={styles.meta}>
                  <p>
                    <strong>{t('job.students.direction')}:</strong> {vacancy.direction.name}
                  </p>
                  <p>
                    <strong>{t('job.students.city')}:</strong>{' '}
                    {vacancy?.cities?.map((city) => city.name).slice(0, 3).join(', ')}
                  </p>
                </div>
                <button
                  className={styles.applyBtn}
                  onClick={() => openSubmitResume(vacancy)}
                >
                  {t('job.students.respond')}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Modal isOpen={!!activeVacancy} onClose={closeModal} width={'20%'}>
        {modalLoading ? (
          <Loader />
        ) : activeVacancy && (
          <InternshipDetailModal
            vacancy={activeVacancy}
            loading={modalLoading}
            onClose={closeModal}
          />
        )}
      </Modal>

      <Modal isOpen={!!resumeVacancy} onClose={closeResumeModal}>
        {resumeVacancy && (
          <FormJob
            vacancyId={resumeVacancy.id}
            isInternship
            onSuccess={closeResumeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default InternshipCards;
