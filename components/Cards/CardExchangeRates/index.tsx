import React, { FC } from 'react'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import Icon from 'components/Icon'
import TableExchangeRates from 'components/Tables/TableExchangeRates'
import style from './card-exchange-rates.module.scss'
import { ExchangeProps } from 'services/api/MainModule'
import { useTranslation } from 'next-i18next'
import HeadingWithNav from 'components/Heading/Heading'

interface CardExchangeRatesProps {
  data: ExchangeProps
}

const formatDateBishkek = (date?: string | Date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Bishkek',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const CardExchangeRates: FC<CardExchangeRatesProps> = ({
  data,
}: CardExchangeRatesProps) => {
  resetIdCounter()

  const { t } = useTranslation()

  const filterNbkr = [
    ...(data?.cash_exchanges || []),
    ...(data?.cashless_exchanges || []),
  ]?.filter((item) => item?.nbkr)

  return (
    <div className={style.card}>
      <HeadingWithNav
        title={t('titles_for_block.exchange_rates')}
        link="/archive-currency"
      />

      <Tabs>
        <TabList>
          <Tab className="react-tabs__tab light-16">
            {t('titles_for_block.exchange_rates_table.cash')}
          </Tab>

          <Tab className="react-tabs__tab light-16">
            {t('titles_for_block.exchange_rates_table.cashless')}
          </Tab>

          <Tab className="react-tabs__tab light-16">
            {t('titles_for_block.exchange_rates_table.gold')}
          </Tab>

          <Tab className="react-tabs__tab light-16">{t('nbkr_short')}</Tab>
        </TabList>

        <p className={style.date}>{formatDateBishkek(data?.created_at)}</p>

        <TabPanel>
          <TableExchangeRates data={data?.cash_exchanges} />
        </TabPanel>

        <TabPanel>
          <TableExchangeRates
            isCashles={true}
            data={data?.cashless_exchanges}
          />
        </TabPanel>

        <TabPanel>
          <TableExchangeRates gold={data?.gold_exchanges} />
        </TabPanel>

        <TabPanel>
          <TableExchangeRates isNbkr={true} data={filterNbkr} />
        </TabPanel>
      </Tabs>

      <div className={style.currency__info}>
        <Icon
          className={style.currency__icon}
          width={24}
          height={24}
          id="info-circle"
        />

        <p className={`${style.currency__text} light-12`}>
          {t('money_exchages_caption')}
        </p>
      </div>

      {data?.bottom_caption && (
        <div className={style.currency__info}>
          <p className={`${style.currency__text} light-12`}>
            {data?.bottom_caption}
          </p>
        </div>
      )}
    </div>
  )
}

export default CardExchangeRates
