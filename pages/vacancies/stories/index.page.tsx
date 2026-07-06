import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  CorporateLifeData,
  SuccessStoriesResponse,
} from 'services/api/OtherApimodule';
import { OtherPageApi } from 'services/api/OtherApi';
import { getTranslations } from 'helpers/serverTranslations';
import Container from 'components/Container';
import StoriesCardSmall from 'components/Vacancies/StoriesCard/StoriesCardSmall';
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner';
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav';
import PaginatedItems from 'components/PaginationCammmon/index.page';
import VideoCarousel from 'pages/vacancies/components/videoCarousel';
import s from './stories.module.scss';
import pic1 from '/public/images/vacancies/cl1.png';
import pic2 from '/public/images/vacancies/cl2.png';
import pic3 from '/public/images/vacancies/cl3.png';
import Loader from 'components/Loader';
import PhotoSlider from 'pages/vacancies/stories/components/PhotoSlider';
import CorporateSlider from 'pages/vacancies/stories/components/CorporateSlider';
import FlipCardsBlock from 'pages/vacancies/stories/components/FlipCardsBlock';

interface Props {
  page_size: string;
  page_count: number;
  stories: SuccessStoriesResponse;
  corporateLife: CorporateLifeData[];
}

const Stories: NextPage<Props> = ({ stories, corporateLife, page_size }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [successStories, setSuccessStories] = useState<SuccessStoriesResponse>(stories);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await OtherPageApi.getHrStuffStoriesClient(router.locale || 'ru', {
          page: currentPage,
          page_size: 4,
          for_who: router.query.for_who || 'individual',
        });
        setSuccessStories(data);
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [currentPage, router.locale, router.query.for_who]);


  const cards = [
    {
      front: t('job.client_care'),
      back: t('job.client_care_desc'),
      image: pic1,
    },
    {
      front: t('job.reputation'),
      back: t('job.reputation_desc'),
      image: pic2,
    },
    {
      front: t('job.team_synergy'),
      back: t('job.team_synergy_desc'),
      image: pic3,
    },
  ];

  const articles = corporateLife[0]?.articles || [];
  const photos = corporateLife[0]?.photos || [];
  const videos = corporateLife[0]?.videos || [];

  return (
    <div className={s.storiesContainer}>
      <VacanciesNav />
      <VacanciesBanner
        hasBtn
        basicText={t('job.corporate_culture')}
        gradientText={t('job.in_eldik_bank')}
        fontSize="80px"
        imgUrl="/images/vacancies/stories.png"
        width={500}
        height={500}
        paddingProp="60px 20px 90px 20px"
      />

      <Container>
        <h2 className={s.title}>{t('job.our_principles')}</h2>

        <FlipCardsBlock cards={cards} />

        {mounted && articles.length > 0 && (
          <>
            <h2 className={s.title}>{t('job.corporate_life')}</h2>
            <CorporateSlider articles={articles} />
          </>
        )}

        {mounted && photos.length > 0 && (
          <PhotoSlider photos={photos} />
        )}

        {videos && videos.length > 0 && (
          <VideoCarousel videos={videos} />
        )}

        <h2 className={s.title}>{t('job.success_stories')}</h2>
        <div className={s.wrapper}>
          {isLoading ? (
            <Loader />
          ) : (
            successStories?.results?.map(({ id, image, title, slug }) => (
              <StoriesCardSmall key={id} image={image} title={title} slug={slug} />
            ))
          )}
        </div>

        <PaginatedItems
          currentPage={currentPage - 1}
          onChangePage={(page) => setCurrentPage(page)}
          itemsPerPage={page_size}
          pageCount={successStories?.page_count || 0}
        />
      </Container>
    </div>
  );
};

export default Stories;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const page = typeof query.page === 'string' ? query.page : '1';
  const page_size = '4';
  const for_who = typeof query.for_who === 'string' ? query.for_who : null;

  const [corporateLifeRes, storiesRes] = await Promise.all([
    OtherPageApi.getCorporateLifePage(locale || 'ru').catch(() => ({ data: {} })),
    OtherPageApi.getHrStuffStories(locale || 'ru', { page, page_size, for_who }).catch(() => ({ data: {} })),
  ]);

  return {
    props: {
      stories: storiesRes.data || {},
      page,
      corporateLife: corporateLifeRes.data || {},
      page_size,
      page_count: storiesRes.data?.page_count || 0,
      ...(await getTranslations(locale || 'ru')),
    },
  };
};
