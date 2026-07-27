import React from 'react'
import s from './vacanciesNav.module.scss'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'

const VacanciesNav = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const navLinks = [
    { href: '/vacancies', label: t('job.vacancies_nav.about') },
    { href: '/vacancies/job-list', label: t('job.vacancies_nav.vacancies') },
    { href: '/vacancies/stories', label: t('job.vacancies_nav.stories') },
    { href: '/vacancies/to-students', label: t('job.vacancies_nav.students') },
    { href: '/vacancies/kelechek', label: 'Kelechek' },
    { href: '/vacancies/resume', label: t('resume_title') },
  ]

  const pathLink = (path: string) => {
    const forWho = router?.query?.for_who
    const query = forWho === 'legal' ? { for_who: 'legal' } : {}

    router.push({
      pathname: path,
      query,
    })
  }

  return (
    <nav className={s.careerNav}>
      <div className={s.careerNavInner}>
        {navLinks.map(({ href, label }) => (
          <button
            key={href}
            onClick={() => pathLink(href)}
            className={clsx(s.link, router.pathname === href && s.active)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default VacanciesNav
