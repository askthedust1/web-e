import clsx from 'clsx'
import Container from 'components/Container'
import { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { getTranslations } from 'helpers/serverTranslations'
import { useState, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { NumericFormat } from 'react-number-format'
import BreadCrumbsCustom from 'components/BreadCrumbsCustom'
import Button from 'components/Buttons/Button'
import s from './calculator.module.scss'

// ── Экспортируемые типы (используются в других модулях) ──

export enum TimeFormatEnum {
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

export interface CurrentDataProps {
  period: number
  perc: number
  sum: number
}

// ── Локальные типы ──

type CalcType = 'credit' | 'deposit'

// Маппинг между внутренним типом и значением URL (?type=...)
// В URL остаётся "depozit" для обратной совместимости со старыми ссылками
const URL_TYPE_MAP: Record<CalcType, string> = {
  credit: 'credit',
  deposit: 'depozit',
}

const urlToCalcType = (urlType: string | string[] | undefined): CalcType => {
  return urlType === 'depozit' ? 'deposit' : 'credit'
}

interface ScheduleRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

interface DepositRow {
  month: number
  interest: number
  total: number
}

interface CreditResult {
  type: 'credit'
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: ScheduleRow[]
}

interface DepositResult {
  type: 'deposit'
  totalInterest: number
  totalAmount: number
  monthlyInterest: number
  schedule: DepositRow[]
}

type CalcResult = CreditResult | DepositResult

const CalculatorPage: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  // Инициализируем тип сразу из query, чтобы избежать мигания при SSR
  const [calcType, setCalcType] = useState<CalcType>(() =>
    urlToCalcType(router.query?.type)
  )
  const [summa, setSumma] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [rate, setRate] = useState<string>('')
  const [result, setResult] = useState<CalcResult | null>(null)
  const [errors, setErrors] = useState<{
    summa: boolean
    term: boolean
    rate: boolean
  }>({ summa: false, term: false, rate: false })

  // ── Синхронизация с URL ──
  // При внешнем изменении query (back/forward, прямой переход) обновляем стейт
  useEffect(() => {
    const fromUrl = urlToCalcType(router.query?.type)
    if (fromUrl !== calcType) {
      setCalcType(fromUrl)
      setResult(null)
      setErrors({ summa: false, term: false, rate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query?.type])

  const validate = () => {
    const newErrors = {
      summa: !summa || parseFloat(summa) <= 0,
      term: !term || parseInt(term) <= 0,
      rate: !rate || parseFloat(rate) <= 0,
    }
    setErrors(newErrors)
    return !newErrors.summa && !newErrors.term && !newErrors.rate
  }

  // ── Расчёт кредита (аннуитет) ──
  const calculateCredit = (data: CurrentDataProps): CreditResult => {
    const monthlyRate = data.perc / 100 / 12

    const monthlyPayment =
      monthlyRate === 0
        ? data.sum / data.period
        : (data.sum * monthlyRate * Math.pow(1 + monthlyRate, data.period)) /
          (Math.pow(1 + monthlyRate, data.period) - 1)

    const schedule: ScheduleRow[] = []
    let balance = data.sum

    for (let i = 1; i <= data.period; i++) {
      const interest = balance * monthlyRate
      const principal = monthlyPayment - interest
      balance = Math.max(0, balance - principal)

      schedule.push({
        month: i,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      })
    }

    const totalPayment = monthlyPayment * data.period

    return {
      type: 'credit',
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round((totalPayment - data.sum) * 100) / 100,
      schedule,
    }
  }

  // ── Расчёт депозита (простые проценты, ежемесячное начисление) ──
  const calculateDeposit = (data: CurrentDataProps): DepositResult => {
    const monthlyRate = data.perc / 100 / 12
    const monthlyInterest = data.sum * monthlyRate

    const schedule: DepositRow[] = []
    let accumulated = data.sum

    for (let i = 1; i <= data.period; i++) {
      accumulated += monthlyInterest
      schedule.push({
        month: i,
        interest: Math.round(monthlyInterest * 100) / 100,
        total: Math.round(accumulated * 100) / 100,
      })
    }

    const totalInterest = monthlyInterest * data.period
    const totalAmount = data.sum + totalInterest

    return {
      type: 'deposit',
      monthlyInterest: Math.round(monthlyInterest * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      schedule,
    }
  }

  const calculate = () => {
    if (!validate()) return

    const data: CurrentDataProps = {
      period: parseInt(term),
      perc: parseFloat(rate),
      sum: parseFloat(summa),
    }

    setResult(
      calcType === 'credit' ? calculateCredit(data) : calculateDeposit(data)
    )
  }

  const handleChange =
    (setter: (v: string) => void, field: keyof typeof errors) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      setErrors((prev) => ({ ...prev, [field]: false }))
      setResult(null)
    }

  const switchType = (type: CalcType) => {
    if (type === calcType) return

    setCalcType(type)
    setResult(null)
    setErrors({ summa: false, term: false, rate: false })

    // Обновляем URL без перезагрузки страницы
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type: URL_TYPE_MAP[type] },
      },
      undefined,
      { shallow: true, locale: router.locale }
    )
  }

  const isCredit = calcType === 'credit'

  return (
    <Container>
      <BreadCrumbsCustom
        currentPage={{
          title: t('calculator.main_title'),
          link: '/calculator',
        }}
      />

      <div className={s.page}>
        <div className={s.heading}>
          <h1 className={s.title}>
            {isCredit
              ? t('calculator.title_credit')
              : t('calculator.title_depozit')}
          </h1>
          <p className={s.subtitle}>
            {isCredit
              ? t('calculator.subtitle')
              : t('calculator.subtitle_deposit')}
          </p>
        </div>

        {/* ── Переключатель кредит / депозит ── */}
        <div className={s.tabs}>
          <button
            type="button"
            className={clsx(s.tab, isCredit && s.tabActive)}
            onClick={() => switchType('credit')}
          >
            {t('calculator.title_credit')}
          </button>
          <button
            type="button"
            className={clsx(s.tab, !isCredit && s.tabActive)}
            onClick={() => switchType('deposit')}
          >
            {t('calculator.title_depozit')}
          </button>
        </div>

        {/* ── Карточка с формой ── */}
        <div className={s.formCard}>
          {/* Сумма */}
          <div className={s.field}>
            <label className={s.fieldLabel}>
              {isCredit
                ? t('calculator.credit_amount')
                : t('calculator.deposit_amount')}
            </label>
            <div className={s.inputWrap}>
              <NumericFormat
                value={summa}
                onValueChange={(v) => {
                  setSumma(v.value)
                  setErrors((prev) => ({ ...prev, summa: false }))
                  setResult(null)
                }}
                placeholder="100 000"
                thousandSeparator=" "
                allowNegative={false}
                decimalScale={2}
                className={clsx(s.input, errors.summa && s.inputError)}
              />
              <span className={s.inputSuffix}>
                {t('calculator.currency_kgs')}
              </span>
            </div>
            {errors.summa && (
              <span className={s.errorText}>
                {t('calculator.summa_required')}
              </span>
            )}
          </div>

          {/* Срок */}
          <div className={s.field}>
            <label className={s.fieldLabel}>
              {isCredit
                ? t('calculator.credit_time')
                : t('calculator.deposit_term')}
            </label>
            <div className={s.inputWrap}>
              <input
                type="number"
                value={term}
                placeholder="12"
                min="1"
                max="360"
                className={clsx(s.input, errors.term && s.inputError)}
                onChange={handleChange(setTerm, 'term')}
              />
              <span className={s.inputSuffix}>
                {t(`calculator.${TimeFormatEnum.Month}`)}
              </span>
            </div>
            {errors.term && (
              <span className={s.errorText}>
                {t('calculator.term_required')}
              </span>
            )}
          </div>

          {/* Ставка */}
          <div className={s.field}>
            <label className={s.fieldLabel}>
              {t('calculator.credit_interest_rate')}
            </label>
            <div className={s.inputWrap}>
              <input
                type="number"
                value={rate}
                placeholder={isCredit ? '18' : '12'}
                min="0"
                step="0.1"
                className={clsx(s.input, errors.rate && s.inputError)}
                onChange={handleChange(setRate, 'rate')}
              />
              <span className={s.inputSuffix}>
                % {t('calculator.per_year')}
              </span>
            </div>
            {errors.rate && (
              <span className={s.errorText}>
                {t('calculator.rate_required')}
              </span>
            )}
          </div>

          <Button
            className={s.submitBtn}
            onClick={calculate}
            value={t('calculator.count')}
            isLong
          />
        </div>

        {/* ── Результат: кредит ── */}
        {result && result.type === 'credit' && (
          <>
            <div className={s.resultCard}>
              <div className={s.statBlock}>
                <div className={s.statLabel}>
                  {t('calculator.monthly_payment')}
                </div>
                <div className={s.statValue}>
                  <NumericFormat
                    value={result.monthlyPayment}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>

              <div className={s.statDivider} />

              <div className={s.statBlock}>
                <div className={s.statLabel}>{t('calculator.total_summ')}</div>
                <div className={s.statValueSm}>
                  <NumericFormat
                    value={result.totalPayment}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>

              <div className={s.statDivider} />

              <div className={s.statBlock}>
                <div className={s.statLabel}>{t('calculator.overpayment')}</div>
                <div className={s.statValueSm}>
                  <NumericFormat
                    value={result.totalInterest}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>
            </div>

            <div className={s.scheduleBlock}>
              <h3 className={s.scheduleTitle}>
                {t('calculator.schedule_title')}
              </h3>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>{t('calculator.payment')}</th>
                      <th>{t('calculator.principal')}</th>
                      <th>{t('calculator.interest_part')}</th>
                      <th>{t('calculator.balance')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td className={s.tdNum}>{row.month}</td>
                        <td>
                          <NumericFormat
                            value={row.payment}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                        <td>
                          <NumericFormat
                            value={row.principal}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                        <td className={s.tdInterest}>
                          <NumericFormat
                            value={row.interest}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                        <td className={s.tdBalance}>
                          <NumericFormat
                            value={row.balance}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Результат: депозит ── */}
        {result && result.type === 'deposit' && (
          <>
            <div className={s.resultCard}>
              <div className={s.statBlock}>
                <div className={s.statLabel}>
                  {t('calculator.total_amount_payout')}
                </div>
                <div className={s.statValue}>
                  <NumericFormat
                    value={result.totalAmount}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>

              <div className={s.statDivider} />

              <div className={s.statBlock}>
                <div className={s.statLabel}>
                  {t('calculator.deposit_added')}
                </div>
                <div className={s.statValueSm}>
                  <NumericFormat
                    value={result.totalInterest}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>

              <div className={s.statDivider} />

              <div className={s.statBlock}>
                <div className={s.statLabel}>
                  {t('calculator.monthly_interest')}
                </div>
                <div className={s.statValueSm}>
                  <NumericFormat
                    value={result.monthlyInterest}
                    displayType="text"
                    thousandSeparator=" "
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" KGS"
                  />
                </div>
              </div>
            </div>

            <div className={s.scheduleBlock}>
              <h3 className={s.scheduleTitle}>
                {t('calculator.accrual_schedule')}
              </h3>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>{t('calculator.interest_part')}</th>
                      <th>{t('calculator.total_with_interest')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td className={s.tdNum}>{row.month}</td>
                        <td className={s.tdInterest}>
                          <NumericFormat
                            value={row.interest}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                        <td className={s.tdBalance}>
                          <NumericFormat
                            value={row.total}
                            displayType="text"
                            thousandSeparator=" "
                            decimalScale={2}
                            fixedDecimalScale
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export default memo(CalculatorPage)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await getTranslations(locale as string)),
    },
  }
}
