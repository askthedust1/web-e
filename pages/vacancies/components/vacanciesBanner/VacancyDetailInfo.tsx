import React from 'react'
import s from './vacanciesBanner.module.scss'
import Icon from 'components/Icon'
import { BranchesInfo } from 'services/api/InfoApiModule'
import { useTranslation } from 'next-i18next'

interface Props {
  location?: BranchesInfo[]
  department?: string
  workTime?: string
  experience?: string
  onApplyClick?: () => void
}

const VacancyDetailInfo: React.FC<Props> = ({
  location,
  department: _department,
  workTime: _workTime,
  onApplyClick,
  experience,
}) => {
  const { t } = useTranslation()
  return (
    <div>
      <div className={s.vacancyInfo}>
        <div className={s.infoItem}>
          <Icon id="location" width={20} height={20} className={s.icon} />
          <span>{location?.map((item) => item.name).join(', ')}</span>
        </div>
        <div className={s.infoItem}></div>
      </div>
      <button className={s.btn} onClick={onApplyClick}>
        {t('job.respond')}
      </button>
    </div>
  )
}

export default VacancyDetailInfo
