import React, { FC } from 'react'
import { useRouter } from 'next/router'
import s from './jobList.module.scss'

// Option D palette: gradient + chip color keyed by department.
const DEPT_PALETTE = [
  { color: '#156CE6', gradient: 'linear-gradient(135deg,#1E7FE0 0%,#73D0F6 100%)' },
  { color: '#5BA84E', gradient: 'linear-gradient(135deg,#23998D 0%,#56C6B0 100%)' },
  { color: '#1B9FD8', gradient: 'linear-gradient(135deg,#2472D6 0%,#5AA7EE 100%)' },
  { color: '#566373', gradient: 'linear-gradient(135deg,#3D4A5C 0%,#637A93 100%)' },
  { color: '#3B5BDB', gradient: 'linear-gradient(135deg,#3B5BDB 0%,#6E8CF2 100%)' },
  { color: '#2FA36B', gradient: 'linear-gradient(135deg,#2FA36B 0%,#7DCB8E 100%)' },
  { color: '#7C6FF0', gradient: 'linear-gradient(135deg,#6A5AE0 0%,#9F8FF2 100%)' },
]

export const deptPalette = (id: number) =>
  DEPT_PALETTE[Math.abs(id) % DEPT_PALETTE.length]

interface Props {
  title: string
  slug: string
  location: { id: number; name: string }[]
  img?: string
  gradient: string
}

const VacancyTile: FC<Props> = ({ title, slug, location, img, gradient }) => {
  const router = useRouter()

  const open = () => {
    const query = router.query.for_who === 'legal' ? { for_who: 'legal' } : {}
    router.push({ pathname: `/vacancies/${slug}`, query })
  }

  const locationText = location
    .map((loc) => loc.name)
    .slice(0, 2)
    .join(', ')

  return (
    <div className={s.card} style={{ background: gradient }} onClick={open}>
      {img && <div className={s.cardImg} style={{ backgroundImage: `url(${img})` }} />}
      <div className={s.cardBody}>
        <div className={s.cardCity}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {locationText}
        </div>
        <h3 className={s.cardTitle}>{title}</h3>
        <div className={s.cardArrow}>
          <span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default VacancyTile
