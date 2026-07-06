import Icon from 'components/Icon'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { FC, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import style from './table-exchange-rates.module.scss'

import clsx from 'clsx'

const RateValue = ({ value }: { value: string | number }) => (
  <NumericFormat
    value={value}
    displayType="text"
    thousandSeparator=" "
    decimalScale={4}
  />
)

interface dataItem {
  id: number
  currency: {
    id: number
    name: string
    code: string
    icon: string
  }
  buy: string
  sell: string
  commission: string
  nbkr: string
}

interface TableExchangeRatesProps {
  isCashles?: boolean
  isNbkr?: boolean
  data?: dataItem[]
  gold?: {
    buy: string
    id: number
    sell: string
    weight: string
  }[]
}

const TableExchangeRates: FC<TableExchangeRatesProps> = ({
  data,
  gold,
  isCashles = false,
  isNbkr = false,
}: TableExchangeRatesProps) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  return (
    <div>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={`${style.table__th} light-14`} align="left">
              {gold ? t('forms.card.weight') : t('forms.card.currency')}
            </th>
            {!isNbkr && (
              <th className={`${style.table__th} light-14`} align="center">
                {t('forms.card.buy')}
              </th>
            )}
            {!isNbkr && (
              <th className={`${style.table__th} light-14`} align="center">
                {t('forms.card.sell')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id}>
              <td className={`${style.table__td}`}>
                <div className={`${style.currency} light-16`}>
                  <div className={style.image}>
                    <Image
                      alt={item.currency.name || ''}
                      src={item.currency.icon || '/'}
                      width={32}
                      height={24}
                      className={style.icon}
                    />
                  </div>
                  {item.currency.name}
                </div>
              </td>
              {!isNbkr && (
                <td className={`${style.table__td}`} align="center">
                  <div className={`${style.currency__value} regular-20`}>
                    <RateValue value={item?.buy} />
                  </div>
                </td>
              )}
              {!isNbkr && (
                <td className={`${style.table__td} regular-20`} align="center">
                  <div className={`${style.currency__value} regular-20`}>
                    <RateValue value={item?.sell} />
                  </div>
                </td>
              )}
              {isNbkr && (
                <td className={`${style.table__td} regular-20`} align="center">
                  <div className={`${style.currency__value} regular-20`}>
                    {Number(item?.nbkr) > 0 ? (
                      <RateValue value={item.nbkr} />
                    ) : (
                      '—'
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {gold?.map((item) => (
            <tr key={item.id}>
              <td className={`${style.table__td}`}>
                <div className={`${style.currency} light-16`}>
                  <div className={style.image}>
                    <Icon id="gold" width={40} height={40} />
                  </div>
                  <RateValue value={item?.weight} />
                </div>
              </td>
              <td className={`${style.table__td}`} align="center">
                <div className={`${style.currency__value} regular-20`}>
                  {Number(item?.buy) > 0 ? <RateValue value={item.buy} /> : '—'}
                </div>
              </td>
              <td className={`${style.table__td} regular-20`} align="center">
                <div className={`${style.currency__value} regular-20`}>
                  <RateValue value={item?.sell} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isCashles && !isNbkr && !gold && (
        <>
          <div onClick={() => setShow(!show)} className={style.comTitle}>
            <div className={clsx(style.iconArrow, show && style.active)}>
              <Icon id="arrow-down" width={18} height={18} />
            </div>
            <p className={style.cuption}>
              {t('titles_for_block.exchange_rates_table.cuption')}
            </p>
          </div>

          <div className={clsx(style.comGrid, show && style.active)}>
            {data?.map((item) => (
              <div key={item.id} className={style.currency}>
                {/* eslint-disable-next-line no-restricted-syntax -- currency flag icon from API is commonly SVG; next/image can't render SVG (dangerouslyAllowSVG off) */}
                <img
                  className={style.icon}
                  src={item.currency.icon}
                  width={16}
                  height={16}
                />
                <p className={style.subcuption}>{item.commission}%</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TableExchangeRates
