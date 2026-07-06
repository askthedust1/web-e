import Link from 'next/link'
import parse from 'html-react-parser'
import Container from 'components/Container'
import style from './islamic-product-card.module.scss'

interface Short {
  id: number
  key: string
  value: string
}

interface IslamicProductCardProps {
  name: string
  short_desc?: string
  slug: string
  shorts?: Short[]
}

// Key financial params shown as highlights on the card
const HIGHLIGHT_KEYS = [
  'чистая сумма',
  'сумма финансирования',
  'наценка',
  'срок финансирования',
  'валюта',
]

const isHighlight = (key: string) =>
  HIGHLIGHT_KEYS.some((k) => key.toLowerCase().includes(k))

const truncate = (str: string, max = 60) =>
  str.length > max ? str.slice(0, max).trimEnd() + '…' : str

const IslamicProductCard = ({
  name,
  short_desc,
  slug,
  shorts = [],
}: IslamicProductCardProps) => {
  const highlights = shorts.filter((s) => isHighlight(s.key)).slice(0, 4)

  const hasSharia = shorts.some((s) => s.key.toLowerCase().includes('шариат'))

  return (
    <Container>
      <div className={style.card}>
        <div className={style.body}>
          <div className={style.header}>
            <h2 className={style.name}>{name}</h2>
            {hasSharia && (
              <span className={style.shariaBadge}>
                ✓ Соответствует нормам Шариата
              </span>
            )}
          </div>

          {short_desc && <div className={style.desc}>{parse(short_desc)}</div>}

          {highlights.length > 0 && (
            <div className={style.highlights}>
              {highlights.map((s) => (
                <div key={s.id} className={style.highlight}>
                  <span className={style.hlLabel}>{s.key}</span>
                  <span className={style.hlValue}>{truncate(s.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={style.action}>
          <Link href={`/islamic-window/${slug}`} className={style.moreBtn}>
            Подробнее
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default IslamicProductCard
