import CkEditor from 'components/CkEditor'
import Container from 'components/Container'
import Image from 'next/image'
import { FC } from 'react'
import style from './card-big.module.scss'

// API media URLs come already percent-encoded; decode once so next/image does
// not double-encode them into an over-long /_next/image URL (HTTP 414).
const decodeMediaUrl = (url: string) => {
  try {
    return decodeURIComponent(url)
  } catch {
    return url
  }
}

interface CardBigProps {
  link?:
    | {
        pathname: string
        query: any
      }
    | string
    | null
    | (() => void)
  id?: number
  img?: string | any
  desc?: string
  title?: string
  is_available?: boolean
  is_creatable?: boolean
  category?: number
  linkBlue?: string
  link_text?: string
  shorts?: {
    id: number
    key: string
    value: string
  }[]
  issuance?: string
  annual_service?: string
  onOpenModal?: () => void
  onOpenInfoModal?: () => void
  currencies?: string
  card_expiration_date?: string
}
const CardBig: FC<CardBigProps> = ({
  title,
  img,
  desc,
  is_available = true,
  is_creatable: _is_creatable,
  category: _category,
  shorts,
  link,
  linkBlue,
  link_text,
  issuance,
  annual_service,
  onOpenModal,
  onOpenInfoModal,
  currencies,
  card_expiration_date,
}: CardBigProps) => {
  return (
    <Container>
      <div className={style.block}>
        <div className={style.imageWrapper}>
          {img && (
            <Image
              alt={title || ''}
              className={style.image}
              src={typeof img === 'string' ? decodeMediaUrl(img) : img}
              width={393}
              height={251}
              sizes="(max-width: 960px) 100vw, 400px"
            />
          )}
        </div>
        <div className={style.desc}>
          <CkEditor
            issuance={issuance}
            annual_service={annual_service}
            is_available={is_available}
            title={title}
            description={desc}
            shorts={shorts}
            link={link}
            linkBlue={linkBlue}
            linkText={link_text}
            onOpenModal={onOpenModal}
            onOpenInfoModal={onOpenInfoModal}
            currencies={currencies}
            card_expiration_date={card_expiration_date}
          />
        </div>
      </div>
    </Container>
  )
}

export default CardBig
