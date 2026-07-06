import React, { FC } from 'react'
import s from './card-long-doc.module.scss'

interface Props {
  data: {
    id: number
    title: string
    ext: string
    file: string
  }
  value: string
}

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1v9M8 10l-3-3M8 10l3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 12v2h12v-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const OpenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="3"
      width="9"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5 7h4M5 9.5h4M5 4.5h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 2l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 5H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const PdfIcon = () => (
  <svg
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 2h11l5 5v19a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"
      fill="#fff"
      stroke="#156ce6"
      strokeWidth="1.5"
    />
    <path
      d="M15 2v5h5"
      stroke="#156ce6"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect x="1" y="13" width="16" height="9" rx="2" fill="#156ce6" />
    <text
      x="9"
      y="20"
      textAnchor="middle"
      fill="white"
      fontSize="5.5"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
    >
      PDF
    </text>
  </svg>
)

const CardLongDoc: FC<Props> = ({ data, value }) => {
  const sanitizeFileName = (name: string) =>
    name.replace(/["'/\\:*?<>|]/g, '').trim()

  return (
    <div className={s.card}>
      <div className={s.titleRow}>
        <div className={s.iconWrap}>
          <PdfIcon />
        </div>
        <p className={s.title}>{data?.title}</p>
      </div>

      <div className={s.actions}>
        <a
          href={data?.file}
          download={`${sanitizeFileName(data.title)}.${data.ext}`}
          target="_blank"
          rel="noreferrer"
          className={`${s.btn} ${s.btnOutline}`}
        >
          <DownloadIcon />
          <span>{value}</span>
        </a>
        <a
          href={data?.file}
          target="_blank"
          rel="noreferrer"
          className={`${s.btn} ${s.btnPrimary}`}
        >
          <OpenIcon />
          <span>Открыть</span>
        </a>
      </div>
    </div>
  )
}

export default CardLongDoc
