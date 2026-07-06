import React, { useEffect, useState, FC } from 'react'
import s from './vacanciesBanner.module.scss'
import EllipseBackground from 'components/Vacancies/EllipseBackground/EllipseBackground'
import GradientBlob from 'components/Vacancies/GradientBlob/GradientBlob'
import { useRouter } from 'next/router'
import { InfoApi } from 'services/api/InfoApi'
import { BranchesInfo } from 'services/api/InfoApiModule'
import VacanciesFilterForm from 'pages/vacancies/components/vacanciesBanner/VacanciesFilterForm'
import VacancyDetailInfo from 'pages/vacancies/components/vacanciesBanner/VacancyDetailInfo'
import SearchPromptBar from 'pages/vacancies/components/vacanciesBanner/SearchPromptBar'
import { useTranslation } from 'next-i18next'
import Modal from 'components/ui/Modal'
import FormJob from 'components/ui/FormJob'
import {
  VacancyFacets,
  VacancyFilters,
} from 'services/api/VacancyFacetsApi.models'

let debounceTimeout: ReturnType<typeof setTimeout>

interface BannerBlockProps {
  basicText?: string
  gradientText: string | JSX.Element
  countVacancies?: number
  searchVacancies?: boolean
  filterVacancies?: boolean
  paddingProp?: string
  imgUrl?: string
  textAlign?: React.CSSProperties['textAlign']
  width?: number
  height?: number
  fontSize?: string
  location?: BranchesInfo[]
  department?: string
  experience?: string
  isDetail?: boolean
  textWidth?: string
  objectFitProp?: string
  facets?: VacancyFacets
  filters?: VacancyFilters
  loading?: boolean
  onSearchChange?: (value: string) => void
  onDepartmentToggle?: (id: number) => void
  onRegionChange?: (value: string) => void
  onCityChange?: (value: string) => void
  onReset?: () => void
  onApplyClick?: () => void
  isReferral?: boolean
  hasBtn?: boolean
  isResume?: boolean
}

const VacanciesBanner: FC<BannerBlockProps> = ({
  basicText,
  gradientText,
  paddingProp,
  textAlign,
  onApplyClick,
  searchVacancies = false,
  filterVacancies = false,
  hasBtn = false,
  imgUrl,
  objectFitProp,
  width = 681,
  department,
  height = 681,
  location,
  facets,
  filters,
  loading = false,
  onSearchChange,
  onDepartmentToggle,
  onRegionChange,
  onCityChange,
  onReset,
  experience,
  fontSize = '90px',
  isDetail,
  countVacancies,
  textWidth,
  isReferral,
  isResume,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const handleOpenPopUp = () => setShowModal(true)
  const handleClosePopUp = () => setShowModal(false)

  useEffect(() => {
    const trimmedSearch = search.trim()

    if (trimmedSearch.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      InfoApi.getPageClient(
        'vacancies',
        router.locale || 'ru',
        '',
        '',
        '',
        '',
        { search: trimmedSearch }
      )
        .then((res) => {
          setResults(res.data?.results || [])
          setShowDropdown(true)
        })
        .catch((err) => {
          console.error(err)
          setResults([])
        })
    }, 400)
  }, [search])

  return (
    <div className={s.banner}>
      <div className={s.careerBanner} style={{ padding: paddingProp }}>
        <GradientBlob
          background="linear-gradient(358deg, rgba(8,126,229,0.8) 25%, rgba(95,222,197,0.77) 71%)"
          size={500}
          top="-100px"
          left="400px"
          blur={150}
          zIndex={-1}
        />
        <GradientBlob
          background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
          size={400}
          top="200px"
          left="1000px"
          blur={150}
          zIndex={-1}
        />
        <GradientBlob
          background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
          size={400}
          top="150px"
          right="550px"
          blur={150}
          zIndex={-1}
        />
        <GradientBlob
          background="linear-gradient(358deg, #00B4F5 0%, #02C8FF 100%)"
          size={300}
          top="300px"
          right="750px"
          blur={150}
          zIndex={-1}
        />
        <GradientBlob
          background="linear-gradient(358deg, #75EA1C 0%, #27FFB3 100%)"
          size={300}
          top="250px"
          left="550px"
          blur={200}
          zIndex={-1}
        />

        <div className={s.leftSideContainer}>
          <h1
            className={s.careerTitle}
            style={{
              fontSize: fontSize,
              textAlign: textAlign || 'inherit',
              maxWidth: textWidth,
              margin: textWidth ? '20px auto' : '',
            }}
          >
            {basicText} <br />
            <span className={s.textGradient}>{gradientText}</span>
            {typeof countVacancies === 'number' && (
              <span className={s.subText}>
                {t('job.search_vacancies')}: {countVacancies}
              </span>
            )}
          </h1>

          {hasBtn && (
            <button className={s.jobBtn} onClick={handleOpenPopUp}>
              {t('job.want_to_work')}
            </button>
          )}

          <Modal isOpen={showModal} onClose={handleClosePopUp}>
            <FormJob onSuccess={handleClosePopUp} />
          </Modal>

          {isDetail && (
            <VacancyDetailInfo
              location={location}
              department={department}
              experience={experience}
              onApplyClick={onApplyClick}
            />
          )}

          {filterVacancies && facets && filters && (
            <VacanciesFilterForm
              facets={facets}
              filters={filters}
              loading={loading}
              onSearchChange={onSearchChange ?? (() => {})}
              onDepartmentToggle={onDepartmentToggle ?? (() => {})}
              onRegionChange={onRegionChange ?? (() => {})}
              onCityChange={onCityChange ?? (() => {})}
              onReset={onReset ?? (() => {})}
            />
          )}

          {searchVacancies && (
            <SearchPromptBar
              search={search}
              setSearch={setSearch}
              results={results}
              setResults={setResults}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}

          {isReferral && (
            <div className={s.referral}>
              <p>
                Приглашай друзей работать в банк и получай бонусы за каждого
                успешно принятого кандидата
              </p>
              <div className={s.btn}>Только для сотрудников Элдик Банка</div>
            </div>
          )}
          {isResume && (
            <div className={s.referral}>
              <p>{t('resume_form.banner_subtitle')}</p>
            </div>
          )}
        </div>

        {imgUrl ? (
          <div className={s.rightSideContainer}>
            <div className={s.relativeWrapper}>
              {/* eslint-disable-next-line no-restricted-syntax -- dynamic banner image may be SVG; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
              <img
                src={imgUrl}
                alt="Иллюстрация карьеры"
                style={{
                  objectFit: objectFitProp ? 'contain' : 'cover',
                  width,
                  height,
                }}
              />
              <EllipseBackground />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default VacanciesBanner
