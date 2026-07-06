import React from 'react'
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner'
import NumberCounter from 'pages/vacancies/components/numberCounter'
import EmployerAwards from 'pages/vacancies/components/awards'
import Values from 'pages/vacancies/components/values'
import VacancyBlock from 'pages/vacancies/components/vacancies'
import { GetServerSideProps, NextPage } from 'next'
import { InfoApi } from 'services/api/InfoApi'
import { OtherPageApi } from 'services/api/OtherApi'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import { TotalData } from 'services/api/InfoApiModule'
import SuccessStories from 'pages/vacancies/components/successStories'
import SelectionProcessBlock from 'pages/vacancies/components/selectionProcess'
import Questions from 'pages/vacancies/components/questions'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import styles from './vacanciesMain.module.scss';
import { IVacancies } from 'services/api/OtherApimodule'
import VideoCarousel from 'pages/vacancies/components/videoCarousel'
import SendResume from 'pages/vacancies/components/sendResume'

interface Props {
  allData: TotalData
  vacancies: IVacancies
  departments: {
    id: number,
    name: string,
    slug: string
  }[]
}

const Vacancies: NextPage<Props> = ({allData, vacancies, departments}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.vacancies}>
      <div className={styles.vacanciesBannerContainer}>
        <VacanciesBanner imgUrl="/images/vacancies/MainPic.png" searchVacancies gradientText={t('job.main_title_gradient')} basicText={t('job.main_title')}/>
      </div>
      <VacanciesNav />
      <div className={styles.wrapper}>
        <NumberCounter />
        <EmployerAwards />
        <Values />
        <VacancyBlock departments={departments} data={allData?.results ?? []}  />
        <SuccessStories data={vacancies?.success_stories || []} />
        <VideoCarousel videos={vacancies.videos} />
        <SelectionProcessBlock />
        <SendResume />
        <Questions vacancies={vacancies} />
      </div>
    </div>
  )
}

export default Vacancies

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const page = '1';
  const page_size = '9';
  const for_who = typeof query.for_who === 'string' ? query.for_who : null;
  const type = 'vacancies';

  let allData: TotalData = {} as TotalData;
  let vacancies: IVacancies = {} as IVacancies;
  let departments: { id: number; name: string; slug: string }[] = [];

  try {
    const allDataResponse = await InfoApi.getPage(
      type,
      locale || 'ru',
      '',
      '',
      '',
      '',
      {
        page,
        page_size,
        for_who,
      }
    );
    allData = allDataResponse?.data || ({} as TotalData);
  } catch (e) {}

  try {
    const vacanciesResponse = await OtherPageApi.getHrStuff(locale || 'ru');
    vacancies = vacanciesResponse?.data || ({} as IVacancies);
  } catch (e) {}

  try {
    const response = await OtherPageApi.getDepartments(locale || 'ru');
    departments = response?.data || [];
  } catch (e) {
    departments = [];
  }

  return {
    props: {
      allData,
      vacancies,
      departments,
      ...(await getTranslations(locale || 'ru')),
    },
  };
};



