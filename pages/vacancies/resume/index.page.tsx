import React from 'react'
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import s from './resumePage.module.scss'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import { TotalData } from 'services/api/InfoApiModule'
import { InfoApi } from 'services/api/InfoApi'
import ResumeForm from 'components/Vacancies/ResumeForm/ResumeForm'
import { ServicePoints } from 'services/api/BranchesApi'

interface Props {
  allData: TotalData
  departments: {
    id: number
    name: string
    slug: string
  }[]
}

const ResumePage: NextPage<Props> = ({ departments }) => {
  const { t } = useTranslation()
  return (
    <div className={s.referralProgram}>
      <VacanciesNav />
      <VacanciesBanner
        gradientText={t('resume_form.banner_title')}
        fontSize={'75px'}
        isResume
        imgUrl="/images/vacancies/resume.png"
        width={650}
        height={600}
      />
      <ResumeForm departmentList={departments} />
    </div>
  )
}

export default ResumePage

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const page = typeof query.page === 'string' ? query.page : '1'
  const page_size = '9'
  const for_who = typeof query.for_who === 'string' ? query.for_who : null
  const region = typeof query.region === 'string' ? query.region : ''
  const city = typeof query.city === 'string' ? query.city : ''
  const department =
    typeof query.department === 'string' ? query.department : ''
  const experience =
    typeof query.experience === 'string' ? query.experience : ''
  const type = 'vacancies'

  let allData: TotalData = {} as TotalData
  let departments: any = []

  try {
    const allDataResponse = await InfoApi.getPage(
      type,
      locale || 'ru',
      region,
      city,
      department,
      experience,
      {
        page,
        page_size,
        for_who,
      }
    )
    allData = allDataResponse?.data || ({} as TotalData)
  } catch (e) {}

  try {
    const response = await ServicePoints.getBranches(locale || 'ru')
    departments = response?.data || []
  } catch (e) {
    departments = []
  }

  return {
    props: {
      allData,
      departments,
      ...(await getTranslations(locale || 'ru')),
    },
  }
}
