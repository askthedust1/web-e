import Button from 'components/Buttons/Button'
import Image from 'next/image'
import style from './tariffs-table.module.scss'

interface Row {
  label: string
  value: React.ReactNode
}

const ROWS: Row[] = [
  {
    label: 'Годовое обслуживание',
    value: (
      <>
        <b>10 000</b> сом
      </>
    ),
  },
  {
    label: 'Снятие наличных',
    value: (
      <>
        Бесплатное снятие наличных до <b>200 000</b> сом в месяц в банкоматах
        других банков КР.
        <br />
        <i>(Снятие свыше 200 000 сом в месяц - 1%, мин. 150 сом)</i>
      </>
    ),
  },
  {
    label: 'Переводы в другие банки',
    value: (
      <>
        <b>1%</b> мин., 150 сом
      </>
    ),
  },
  {
    label: 'Кешбэк',
    value: (
      <>
        <b>2%</b> от суммы, на все безналичные операции по карте в POS-терминалах
        и интернет-платежи
      </>
    ),
  },
  {
    label: 'Срок действия',
    value: (
      <>
        <b>5</b> лет
      </>
    ),
  },
]

const TariffsTable = () => {
  return (
    <div className={style.wrapper}>
      <p className={`medium-32 ${style.title}`}>Тарифы Visa Infinite</p>
      <div className={style.content}>
        <div className={style.table}>
          {ROWS.map((row) => (
            <div className={style.row} key={row.label}>
              <div className={`medium-16 ${style.labelCell}`}>{row.label}</div>
              <div className={`regular-15 ${style.valueCell}`}>{row.value}</div>
            </div>
          ))}
        </div>
        <div className={style.cardsImage}>
          <Image
            src="/images/we-card/cards1.png"
            alt="Карты World Elite"
            width={520}
            height={440}
          />
        </div>
      </div>
      <div className={style.actions}>
        <Button value="Все тарифы" href="/tarifs" isOutline />
      </div>
    </div>
  )
}

export default TariffsTable
