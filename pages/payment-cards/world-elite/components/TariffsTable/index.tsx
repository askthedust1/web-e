import Button from 'components/Buttons/Button'
import CardsMock from './CardsMock'
import style from './tariffs-table.module.scss'

const ROWS = [
  { label: 'Годовое обслуживание', value: '10 000 сом' },
  {
    label: 'Снятие наличных',
    value:
      'Бесплатное снятие наличных до 200 000 сом в месяц в банкоматах других банков КР. (Снятие свыше 200 000 сом в месяц - 7%, мин. 150 сом)',
  },
  { label: 'Переводы в другие банки', value: '1% мин., 150 сом' },
  {
    label: 'Кешбэк',
    value:
      '2% от суммы, на все безналичные операции по карте в POS-терминалах и интернет-платежи',
  },
  { label: 'Срок действия', value: '5 лет' },
]

const TariffsTable = () => {
  return (
    <div className={style.wrapper}>
      <p className={`medium-32 ${style.title}`}>Тарифы Visa Infinite</p>
      <div className={style.content}>
        <div className={style.tableWrap}>
          {ROWS.map((row) => (
            <div className={style.row} key={row.label}>
              <p className={`medium-16 ${style.label}`}>{row.label}</p>
              <p className={`regular-15 ${style.value}`}>{row.value}</p>
            </div>
          ))}
        </div>
        <div className={style.cardsImage}>
          <CardsMock />
        </div>
      </div>
      <div className={style.actions}>
        <Button value="Все тарифы" href="/tarifs" isOutline />
      </div>
    </div>
  )
}

export default TariffsTable
