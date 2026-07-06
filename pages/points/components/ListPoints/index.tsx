import s from './list-point.module.scss'
import { FC, useState } from 'react'
import { Branches, ServiceDetailProps } from 'services/api/BranchesApimodule'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import CardServicePoint from 'pages/points/components/CardServicePoint'

interface Props {
  data: Branches[]
  onHoverItem?: (id: number | null) => void
  getDetailInfo(slug: string): void
  detailPoint: ServiceDetailProps | null
}

const ListPoints: FC<Props> = ({
  data,
  onHoverItem,
  getDetailInfo,
  detailPoint,
}) => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleShowDetails = async (slug: string, id: number) => {
    try {
      setSelectedId(id)
      await getDetailInfo(slug)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching point details:', error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedId(null)
  }

  const shouldShowModal =
    showModal && detailPoint && selectedId === detailPoint.id

  return (
    <>
      <div className={s.listPoints}>
        {data?.map((item) => (
          <div
            key={item.id}
            className={s.item}
            onMouseEnter={() => onHoverItem && onHoverItem(item.id)}
            onMouseLeave={() => onHoverItem && onHoverItem(null)}
          >
            {item.icon && (
              <div className={s.icon}>
                {/* eslint-disable-next-line no-restricted-syntax -- dynamic point icon may be SVG; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
                <img src={item.icon} alt={item.name} width={40} height={40} />
              </div>
            )}

            <div className={s.info}>
              <h3>{item.name}</h3>
              <p className={s.city}>{item.address}</p>

              {item.phones?.length > 0 && (
                <p className={s.phone}>
                  <a href={`tel:${item.phones[0].phone}`}>
                    {item.phones[0].phone}
                  </a>
                </p>
              )}

              <p className={clsx(s.status, item.is_open ? s.open : s.closed)}>
                {item?.status}
              </p>

              <button
                className={s.detailsButton}
                onClick={() => handleShowDetails(item.slug, item.id)}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                      stroke="#156CE6"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{' '}
                    <path
                      d="M12 6V12"
                      stroke="#156CE6"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{' '}
                    <path
                      d="M16.24 16.24L12 12"
                      stroke="#156CE6"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{' '}
                  </g>
                </svg>{' '}
                <span>{t('time_work')}</span>
              </button>
            </div>
          </div>
        ))}

        {data?.length === 0 && (
          <div className={clsx(s.cuption, 'regular-20')}>{t('not_found')}</div>
        )}
      </div>

      {shouldShowModal && detailPoint && (
        <CardServicePoint setDetailService={closeModal} data={detailPoint} />
      )}
    </>
  )
}

export default ListPoints
