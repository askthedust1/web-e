import React from 'react'
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import s from './referralProgram.module.scss'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import Container from 'components/Container'
import AppImage from 'components/ui/AppImage'
import VacancyBlock from 'pages/vacancies/components/vacancies'
import { TotalData } from 'services/api/InfoApiModule'
import { InfoApi } from 'services/api/InfoApi'
import { OtherPageApi } from 'services/api/OtherApi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'

interface Props {
  allData: TotalData
  departments: {
    id: number
    name: string
    slug: string
  }[]
}

const ReferralProgram: NextPage<Props> = ({ allData, departments }) => {
  const { t: _t } = useTranslation()

  const referralSteps = [
    {
      id: 1,
      title: 'Рекомендуй кандидата',
      description:
        'Поделись вакансией с другом, знакомым или бывшим коллегой. Заполни короткую форму и укажи контактные данные кандидата.',
      image: '/images/vacancies/num1.png',
      width: 111,
      height: 247,
    },
    {
      id: 2,
      title: 'Кандидат проходит отбор',
      description:
        'HR-служба связывается с кандидатом, проводит собеседования и оценивает его квалификацию.',
      image: '/images/vacancies/num2.png',
      width: 175,
      height: 217,
    },
    {
      id: 3,
      title: 'Он выходит на работу',
      description:
        'После успешного прохождения отбора кандидат становится частью нашей команды.',
      image: '/images/vacancies/num3.png',
      width: 175,
      height: 187,
    },
    {
      id: 4,
      title: 'Ты получаешь бонус',
      description:
        'Как только кандидат завершит испытательный срок — ты получаешь денежное вознаграждение на свою карту.',
      image: '/images/vacancies/num4.png',
      width: 195,
      height: 217,
    },
  ]

  return (
    <div className={s.referralProgram}>
      <VacanciesNav />
      <VacanciesBanner
        gradientText="РЕФЕРАЛЬНАЯ ПРОГРАММА"
        isReferral
        imgUrl="/images/vacancies/resume.png"
        width={750}
        height={600}
      />
      <Container>
        <div className={s.howitworks}>
          <h3>Как это работает?</h3>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className={s.swiper}
          >
            {referralSteps.map((step) => (
              <SwiperSlide key={step.id}>
                <div className={s.card}>
                  <AppImage
                    src={step.image}
                    alt="Иллюстрация карьеры"
                    style={{ objectFit: 'cover' }}
                    width={step.width}
                    height={step.height}
                  />
                  <div className={s.cardInner}>
                    <div className={s.stepTitle}>{step.title}</div>
                    <div className={s.stepDescriprion}>{step.description}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <h3>Кого можно рекомендовать?</h3>
          <VacancyBlock
            departments={departments}
            data={allData?.results ?? []}
          />
        </div>
      </Container>
    </div>
  )
}

export default ReferralProgram

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
  let departments: { id: number; name: string; slug: string }[] = []

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
    const response = await OtherPageApi.getDepartments(locale || 'ru')
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
