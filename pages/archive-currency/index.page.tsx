import clsx from 'clsx'
import Container from 'components/Container'
import Icon from 'components/Icon'
import InputDataPicker from 'components/Input/InputDataPicker'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { useState, useEffect } from 'react'
import { ArchiveCurrencyApi } from 'services/api/ArchiveCurrencyApi'
import { ArchiveCurrencyApiModule } from 'services/api/ArchiveCurrencyApiModule'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import CardExchangeRates from 'components/Cards/CardExchangeRates'
import { useTranslation } from 'next-i18next'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Head from 'next/head'
import { NumericFormat } from 'react-number-format'
import s from './archive-currency.module.scss'

interface Props {
  data: ArchiveCurrencyApiModule
}

const formatDateBishkek = (date?: string) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Bishkek',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const RateValue = ({ value }: { value: string | number }) => (
  <NumericFormat
    value={value}
    displayType="text"
    thousandSeparator=" "
    decimalScale={4}
  />
)

const ArchiveCurrency: NextPage<Props> = ({ data }) => {
  const router = useRouter()
  const { query } = router
  const [state, setState] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(
    query?.date ? new Date(query.date as string) : new Date()
  )

  const selectData = (date: Date) => {
    const route = format(new Date(date), 'yyyy-MM-dd')

    router.push(
      `/archive-currency/?date=${route}&for_who=${
        query?.for_who ? query.for_who : 'individual'
      }`
    )
    setDate(date)
  }
  useEffect(() => {
    if (query?.date) {
      setDate(new Date(query.date as string))
    }
  }, [query?.date])
  const { t } = useTranslation()

  return (
    <>
      <Head>
        <title>
          {t('titles_for_block.exchange_rates_table.title') +
            '-' +
            t('seo_titles.rsk_bank')}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content={
            t('titles_for_block.exchange_rates_table.title') +
            '-' +
            t('seo_titles.rsk_bank')
          }
          key="og:title"
        />
        <meta
          property="og:description"
          content={
            t('titles_for_block.exchange_rates_table.title') +
            '-' +
            t('seo_titles.rsk_bank')
          }
          key="og:description"
        />
        <meta
          name="description"
          content={
            t('titles_for_block.exchange_rates_table.title') +
            '-' +
            t('seo_titles.rsk_bank')
          }
          key="description"
        />
        <meta
          name="keywords"
          content={
            t('titles_for_block.exchange_rates_table.title') +
            '-' +
            t('seo_titles.rsk_bank')
          }
          key="keywords"
        />
      </Head>

      <Section>
        <Container>
          <BreadCrumbsCustom
            currentPage={{
              title: t('titles_for_block.exchange_rates_table.title'),
              link: '/archive-currency',
            }}
          />
          <div className={s.wrapper}>
            <div className={s.titleWrapper}>
              <p className={s.title}>
                {t('titles_for_block.exchange_rates_table.title')}
              </p>
              <p className={s.subtitle}>
                {t('titles_for_block.exchange_rates_table.subtitle')}
              </p>
              {data?.created_at && (
                <p className={s.actualOn}>
                  {t('titles_for_block.exchange_rates_table.actual_on')}{' '}
                  {formatDateBishkek(data.created_at)}
                </p>
              )}
            </div>

            <div className={s.datePcike}>
              <InputDataPicker
                placeholder={t('choose_date')}
                selected={date}
                maxDate={new Date()}
                dateFormat="dd.MM.yyyy"
                onChange={(e) => selectData(e)}
              />
            </div>
          </div>
          <Section className={s.blockGrid}>
            <Section className={s.blockWrapper}>
              <div className={s.titles}>
                <p className={s.title2}>
                  {t('titles_for_block.exchange_rates')}
                </p>
                <div className={s.middleNav}>
                  <p
                    className={clsx(
                      s.middleNavLink,
                      state === false && s.middleNavLinkActive
                    )}
                    onClick={() => setState(false)}
                  >
                    {t('titles_for_block.exchange_rates_table.cash')}
                  </p>
                  <p
                    className={clsx(
                      s.middleNavLink,
                      state === true && s.middleNavLinkActive
                    )}
                    onClick={() => setState(true)}
                  >
                    {t('titles_for_block.exchange_rates_table.cashless')}
                  </p>
                </div>
              </div>
              {!state ? (
                <div className={s.repayment_schedule}>
                  <table className={s.table}>
                    <thead className={s.thead}>
                      <tr className={s.tr}>
                        <th className={s.thMain}>
                          <p className={s.thItems}>
                            {t('forms.card.currency')}
                          </p>
                        </th>
                        <th className={s.th}>
                          <p className={s.thItems}> {t('forms.card.buy')}</p>
                        </th>
                        <th className={s.th}>
                          <p className={s.thItems}> {t('forms.card.sell')}</p>
                        </th>
                        <th className={s.th}>
                          <p className={s.thItems}> {t('nbkr')}</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.cash_exchanges?.map((item) => (
                        <tr key={item.id} className={s.tr}>
                          <td className={s.tdMain}>
                            <div className={s.tdItemMain}>
                              {/* eslint-disable-next-line no-restricted-syntax -- currency flag icon may be SVG; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
                              <img
                                className={s.currencyIcon}
                                src={item.currency.icon}
                              />{' '}
                              {item.currency.name}
                            </div>
                          </td>
                          <td className={s.td}>
                            <div className={s.tdItem}>
                              <RateValue value={item?.buy || 0} />
                            </div>
                          </td>
                          <td className={s.td}>
                            <div className={s.tdItem}>
                              <RateValue value={item?.sell || 0} />
                            </div>
                          </td>
                          <td className={s.td}>
                            <div className={s.tdItem}>
                              {Number(item?.nbkr) > 0 ? (
                                <RateValue value={item.nbkr} />
                              ) : (
                                '—'
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div onClick={() => setShow(!show)} className={s.comTitle}>
                    <div className={clsx(s.iconArrow, show && s.active)}>
                      <Icon id="arrow-down" width={18} height={18} />
                    </div>
                    <p className={s.cuption}>
                      {t('titles_for_block.exchange_rates_table.cuption')}
                    </p>
                  </div>
                  <div className={clsx(s.comGrid, show && s.active)}>
                    {data?.cash_exchanges?.map((item) => (
                      <div key={item.id} className={s.currency}>
                        {/* eslint-disable-next-line no-restricted-syntax -- currency flag icon may be SVG; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
                        <img
                          className={s.icon}
                          src={item.currency.icon}
                          width={16}
                          height={16}
                        />
                        {item?.commission || 0}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={s.repayment_schedule}>
                  <table className={s.table}>
                    <thead className={s.thead}>
                      <tr className={s.tr}>
                        <th className={s.thMain}>
                          <p className={s.thItems}>
                            {t('forms.card.currency')}
                          </p>
                        </th>
                        <th className={s.th}>
                          <p className={s.thItems}>{t('forms.card.buy')}</p>
                        </th>
                        <th className={s.th}>
                          <p className={s.thItems}>{t('forms.card.sell')}</p>
                        </th>
                        {/* <th className={s.th}>
                          <p className={s.thItems}> {t('nbkr')}</p>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data?.cashless_exchanges?.map((item) => (
                        <tr key={item.id} className={s.tr}>
                          <td className={s.tdMain}>
                            <div className={s.tdItemMain}>
                              {/* eslint-disable-next-line no-restricted-syntax -- currency flag icon may be SVG; next/image can't optimize SVG (no dangerouslyAllowSVG) */}
                              <img
                                className={s.currencyIcon}
                                src={item.currency.icon}
                              />{' '}
                              {item.currency.name}
                            </div>
                          </td>
                          <td className={s.td}>
                            <div className={s.tdItem}>
                              <RateValue value={item?.buy || 0} />
                            </div>
                          </td>
                          <td className={s.td}>
                            <div className={s.tdItem}>
                              <RateValue value={item?.sell || 0} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
            <Section className={s.blockWrapper}>
              <div className={s.titles}>
                <p className={s.title2}>
                  {t('titles_for_block.exchange_rates_table.gold')}
                </p>
              </div>
              <div className={s.repayment_schedule}>
                <table className={s.table}>
                  <thead className={s.thead}>
                    <tr className={s.tr}>
                      <th className={s.thMain}>
                        <p className={s.thItems}>{t('forms.card.weight')}</p>
                      </th>
                      <th className={s.th}>
                        <p className={s.thItems}>{t('forms.card.buy')}</p>
                      </th>
                      <th className={s.th}>
                        <p className={s.thItems}>{t('forms.card.sell')}</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.gold_exchanges?.map((item) => (
                      <tr key={item.id} className={s.tr}>
                        <td className={s.tdMain}>
                          <div className={s.tdItemMain}>
                            <Icon id="gold" width={25} height={20} />
                            <RateValue value={item.weight} />{' '}
                            {t('forms.card.gramm')}
                          </div>
                        </td>
                        <td className={s.td}>
                          <div className={s.tdItem}>
                            {Number(item?.buy) > 0 ? (
                              <RateValue value={item.buy} />
                            ) : (
                              <span
                                title={t(
                                  'titles_for_block.exchange_rates_table.buy_not_available'
                                )}
                              >
                                —
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={s.td}>
                          <div className={s.tdItem}>
                            <RateValue value={item?.sell || 0} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </Section>
          <div className={s.mobileCard}>
            <CardExchangeRates data={data} />
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ArchiveCurrency
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const type: any = query
  const lang: any = locale
  const date2 = (type.date || format(new Date(), 'yyyy-MM-dd')) as string
  const chech: any =
    type?.date?.length !== 0 ? { date: date2 } : { date: type.date }
  const { data } = await ArchiveCurrencyApi.getExchange(lang || 'ru', chech)
  return {
    props: {
      data: data,
      chech,
      ...(await getTranslations(lang)),
    },
  }
}
