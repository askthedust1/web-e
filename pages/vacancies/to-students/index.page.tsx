import React, { useState, useCallback } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import Container from 'components/Container'
import VacanciesBanner from 'pages/vacancies/components/vacanciesBanner'
import VacanciesNav from 'components/Vacancies/VacanciesNav/VacanciesNav'
import Modal from 'components/ui/Modal'
import FormJob from 'components/ui/FormJob'
import s from './toStudents.module.scss'
import InternshipCard from 'components/Vacancies/InternshipCard/InternshipCard'
import { OtherPageApi } from 'services/api/OtherApi'
import StudentsVacancyCards from 'pages/vacancies/to-students/components/InternshipCards'
import PracticeButton from 'pages/vacancies/to-students/components/PracticeButton'

interface Props {
  internships: any
  departments: { id: number; name: string; slug: string }[];
}

const ToStudents: NextPage<Props> = ({ internships, departments }) => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [formType, setFormType] = useState<'internship' | 'practice' | null>(null)

  const gradients = [
    'linear-gradient(135deg, rgba(212, 231, 255, 0.6) 0%, rgba(164, 229, 232, 0.6) 100%)',
    'linear-gradient(135deg, rgba(212, 231, 255, 0.6) 0%, rgba(129, 205, 233, 0.6) 100%)',
    'linear-gradient(135deg, rgba(164, 229, 232, 0.6) 0%, rgba(225, 255, 193, 0.6) 100%)',
    'linear-gradient(135deg, rgba(225, 255, 193, 0.6) 0%, rgba(193, 212, 255, 0.6) 100%)',
  ]

  const handleOpenPopUp = useCallback((type: 'internship' | 'practice') => {
    setFormType(type)
    setShowModal(true)
  }, [])

  const handleClosePopUp = useCallback(() => setShowModal(false), [])

  const marqueeText = Array(3).fill(t('job.students.marquee')).join('')

  return (
    <div className={s.toStudents}>
      <VacanciesNav />

      <VacanciesBanner
        gradientText={t('job.students.main')}
        imgUrl="/images/vacancies/to-students.png"
        width={500}
        height={600}
        fontSize="80px"
      />

      <div className={s.marqueeTrack}>
        <div className={s.marqueeContent}>
          {marqueeText.split('•').map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item.trim()}</span>
              {idx < marqueeText.split('•').length - 1 && <span className={s.marqueeDot}>•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Container>
          <section className={s.internshipWrapper}>
            <h2 className={s.title}>{t('job.students.internship_title')}</h2>
            <div className={s.internship}>
              <InternshipCard
                image="/images/vacancies/pic1.png"
                text={t('job.students.internship_card_1')}
                big
                width={427}
                height={316}
                gradient={gradients[0 % gradients.length]}
              />
              <div className={s.rightSide}>
                <InternshipCard
                  image="/images/vacancies/pic2.png"
                  title={t('job.students.internship_card_2_title')}
                  text={t('job.students.internship_card_2_text')}
                  gradient={gradients[1 % gradients.length]}
                />
                <InternshipCard
                  image="/images/vacancies/pic3.png"
                  title={t('job.students.internship_card_3_title')}
                  text={t('job.students.internship_card_3_text')}
                  gradient={gradients[2 % gradients.length]}
                />
              </div>
            </div>
            <InternshipCard
              image="/images/vacancies/pic4.png"
              title={t('job.students.internship_card_4_title')}
              text={t('job.students.internship_card_4_text')}
              width={415}
              height={233}
              isCardBottom
              gradient={gradients[3 % gradients.length]}
            />
          </section>

        {departments?.length > 0 && internships?.results?.length > 0 && (
          <div style={{ width: '100%' }}>
            <StudentsVacancyCards departments={departments} vacancies={internships?.results} />
          </div>
        )}

        <section className={s.practiceWrapper}>
          <h2 className={s.title}>{t('job.students.practice_title')}</h2>
          <div className={s.practice}>
            <div className={s.rightSide}>
              <InternshipCard
                image="/images/vacancies/ph2.png"
                title={t('job.students.practice_card_1_title')}
                text={t('job.students.practice_card_1_text')}
                gradient={gradients[4 % gradients.length]}
              />
              <InternshipCard
                image="/images/vacancies/ph3.png"
                title={t('job.students.practice_card_2_title')}
                text={t('job.students.practice_card_2_text')}
                gradient={gradients[5 % gradients.length]}
              />
            </div>
            <InternshipCard
              image="/images/vacancies/ph1.png"
              text={t('job.students.practice_card_3')}
              big
              width={427}
              height={316}
              gradient={gradients[6 % gradients.length]}
            />
          </div>
          <InternshipCard
            image="/images/vacancies/ph4.png"
            title={t('job.students.practice_card_4_title')}
            text={t('job.students.practice_card_4_text')}
            width={415}
            height={233}
            isCardBottom
            gradient={gradients[7 % gradients.length]}
          />
        </section>

        <PracticeButton handleOpenPopUp={handleOpenPopUp} />
      </Container>

      <Modal isOpen={showModal} onClose={handleClosePopUp}>
        <FormJob
          isPractice={formType === 'practice'}
          isInternship={formType === 'internship'}
          onSuccess={handleClosePopUp}
        />
      </Modal>
    </div>
  )
}

export default ToStudents

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const page = typeof query.page === 'string' ? query.page : '1'
  const page_size = '15'
  const for_who = typeof query.for_who === 'string' ? query.for_who : null

  const [internshipsData, departmentsData] = await Promise.all([
    OtherPageApi.getInternshipsServer(locale || 'ru', { page: '1', page_size, for_who }).catch(() => ({ data: {} })),
    OtherPageApi.getInternshipsDepartments(locale || 'ru').catch(() => ({ data: [] }))
  ])

  return {
    props: {
      internships: internshipsData.data || {},
      departments: departmentsData.data || [],
      page,
      page_size,
      page_count: internshipsData.data?.page_count || 0,
      ...(await getTranslations(locale || 'ru')),
    },
  }
}
