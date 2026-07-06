import { useState, useMemo, useEffect } from 'react'
import Heading from 'components/Heading/Heading'
import Section from 'components/Section'
import Container from 'components/Container'
import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import ReactSlider from 'react-slider'
import s from './../Calculator/calc.module.scss'
import { RscInputNumber } from 'components/ui/inputNumber'

type Credit = {
  id: number
  slug: string
  name: string
  calc_currencies: CurrencyRange[]
}

interface CalcPercents  {
  id: number
  perc: string
  step: number
  period: {
    id: number
    measure: 'month' | 'year'
    start: number
    end: number
  }
}[]

type CurrencyRange = {
  id: number
  currency: {
    id: number
    name: string
    code: string
    icon: string
  }
  min_sum: number
  max_sum: number
  calc_percents: CalcPercents[]
}

interface Props {
  credit: Credit
  caption: string
}

function filterByCurrency(data: CurrencyRange[], currencyCode: string): CurrencyRange[] {
  return data.filter(item => item.currency.code === currencyCode);
}

const IslamicCreditCalculator = ({ credit }: Props) => {
  const { t } = useTranslation()
  const [calcCurrency, setCalcCurrency] = useState<CurrencyRange[]>([])
  useEffect(() => {
    if(credit?.calc_currencies?.length) {
      setCalcCurrency(filterByCurrency(credit?.calc_currencies, credit?.calc_currencies[0]?.currency?.code))
    }
  }, [credit?.calc_currencies])
  const globalMin = useMemo(
    () => Math.min(...calcCurrency?.map(r => r.min_sum)),
    [calcCurrency]
  )
  const globalMax = useMemo(() => {
    const maxSums = calcCurrency?.map(r => r.max_sum === 0 ? Infinity : r.max_sum)
    const realMax = Math.max(...maxSums)
    return realMax === Infinity ? 10000000 : realMax
  }, [calcCurrency])

  const [sum, setSum] = useState<number>(globalMin)
  const [sumFinancingAmount , setSumFinancingAmount] = useState<number>(0)
  const [sumDownPayment, setSumDownPayment] = useState<number>(0)

  const [term, setTerm] = useState<number>(12)
  const [currentRange, setCurrentRange] = useState<CurrencyRange | null>(null)
  const [availableTerms, setAvailableTerms] = useState<number[]>([])


  useEffect(() => {
    const range = calcCurrency?.find(range => {
      const max = range.max_sum === 0 ? Infinity : range.max_sum
      return sum >= range.min_sum && sum <= max
    }) || null
    setCurrentRange(range)

    if (range) {
      const terms = range?.calc_percents?.map(p => p.period.start)
      setAvailableTerms(terms)
      if (!terms.includes(term)) {
        setTerm(terms[0])
      }
    } else {
      setAvailableTerms([])
    }
  }, [sum, calcCurrency])

  useEffect(() => {
    setSum(globalMin)
    setSumFinancingAmount(globalMin)
  }, [globalMin])

  const matchedPercent = useMemo(() => {
    if (!currentRange) return null
    return currentRange?.calc_percents?.find(p => p.period.start === term)
  }, [currentRange, term])

  const markupAmount = useMemo(() => {
    if (!matchedPercent) return 0
    const perc = parseFloat(matchedPercent.perc)
    return Math.round((sum * perc) / 100)
  }, [sum, matchedPercent])

  const totalAmount = useMemo(() => {
    return sum + markupAmount
  }, [sum, markupAmount])

  const monthlyPayment = useMemo(() => {
    return Math.round(totalAmount / term)
  }, [totalAmount, term])

  const handleSumChange = (value: string) => {
    const valueNum = parseInt(value) || 0
    setSum(valueNum)
  }

  const handleSumBlur = () => {
    let newValue = sum
    if (newValue < globalMin) newValue = globalMin
    if (newValue > globalMax) newValue = globalMax

    setSum(newValue)
    setSumFinancingAmount(newValue)
  }

  const formatNumber = (num: number) => {
    return String(num).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
  }

  const sumMarks = useMemo(() => {
    const marksSet = new Set<number>()

    calcCurrency?.forEach(range => {
      marksSet.add(range.min_sum)
      if (range.max_sum !== 0) {
        marksSet.add(range.max_sum)
      }
    })

    return Array.from(marksSet).sort((a, b) => a - b)
  }, [credit])
  const seen = new Set<string>();

  const filtered = credit?.calc_currencies.filter(i => {
    const code = i.currency.code;
    return !seen.has(code) && seen.add(code);
  });

  useEffect(() => {
    if(sumFinancingAmount | sumDownPayment) {
      const sumResult = sumFinancingAmount - sumDownPayment
      setSum(Number(sumResult || 0))
    }
  }, [sumFinancingAmount, sumDownPayment])
  return (
    <Section className={s.calc}>
      <Container>
        <Heading title={credit.name} />
        <div className={s.calcGrid}>
          <div>
            <div className={s.calcGridLeft}>
              <div style={{ display: 'flex' }}>
                <div className={s.formItem} style={{ margin: '0 0 50px 0' }}>
                  <RscInputNumber
                    type="number"
                    isNumberFormat
                    label={t("islamic_credit.amount")}
                    value={sumFinancingAmount?.toString()}
                    handleChangeNumber={(value) => {
                      const valueNum = parseInt(value) || 0
                      setSumFinancingAmount(valueNum)
                    }}
                    className={clsx(s.formItemInput, 'light-16', 'height-150', 'border-black')}
                  />
                  <div className={s.cuption}>
                    <div className={clsx(s.from, 'light-12')}>
                      {t('short.from')} {formatNumber(globalMin)}
                    </div>
                    <div className={clsx(s.to, 'light-12')}>
                      {t('short.till')} {formatNumber(globalMax)}
                    </div>
                  </div>
                  <div className={s.slider}>
                    <ReactSlider
                      className="custom-slider"
                      min={globalMin}
                      max={globalMax}
                      value={sumFinancingAmount}
                      onChange={setSumFinancingAmount}
                      thumbClassName="custom-thumb"
                      trackClassName="custom-track"
                      marks={sumMarks}
                      step={1}
                      markClassName="example-mark"
                      renderMark={(props) => {
                        const isActive = sumMarks.includes(Number(props.key))
                        return isActive ? <span {...props} /> : null
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={s.formItem} style={{ margin: '0 0 50px 0' }}>
                  <RscInputNumber
                    type="number"
                    isNumberFormat
                    label={t("savingsMortgage.mortgage_info_down_payment")}
                    value={sumDownPayment?.toString()}
                    max={sumFinancingAmount}
                    handleChangeNumber={(value) => {
                      const valueNum = parseInt(value) || 0
                      setSumDownPayment(valueNum)
                    }}
                    onBlur={(_e) => {
                      if((sumDownPayment >= sumFinancingAmount)) {
                        setSumDownPayment(globalMin)
                        setSum(sumFinancingAmount)
                      }
                    }}
                    className={clsx(s.formItemInput, 'light-16', 'height-150', 'border-black')}
                  />
                  <div className={s.cuption}>
                    <div className={clsx(s.from, 'light-12')}>
                      {t('short.from')} {formatNumber(globalMin)}
                    </div>
                    <div className={clsx(s.to, 'light-12')}>
                      {t('short.till')} {formatNumber(sumFinancingAmount)}
                    </div>
                  </div>
                  <div className={s.slider}>
                    <ReactSlider
                      className="custom-slider"
                      min={0}
                      max={sumFinancingAmount}
                      value={sumDownPayment}
                      onChange={setSumDownPayment}
                      thumbClassName="custom-thumb"
                      trackClassName="custom-track"
                      marks={sumMarks}
                      step={1}
                      markClassName="example-mark"
                      renderMark={(props) => {
                        const isActive = sumMarks.includes(Number(props.key))
                        return isActive ? <span {...props} /> : null
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div className={s.formItem} style={{ margin: '0 0 50px 0' }}>
                  <RscInputNumber
                    type="number"
                    isNumberFormat
                    min={globalMin}
                    max={globalMax}
                    label={t("islamic_credit.total_financing")}
                    disabled
                    value={sum?.toString()?.includes("-") ? "0" : sum?.toString()}
                    handleChangeNumber={handleSumChange}
                    onBlur={handleSumBlur}
                    className={clsx(s.formItemInput, 'light-16', 'height-150', 'border-black')}
                  />
                </div>
                <div className={s.formItem} style={{ marginTop: 10 }}>
                  <select
                    className={clsx(
                      s.formItemSelect,
                      'light-16',
                      'height-150',
                      'border-black',
                    )}
                    onChange={(e) => {
                      const selectedIndex = e.target.selectedIndex
                      const selectedOption = e.target.options[selectedIndex]
                      const id = selectedOption.id
                      setCalcCurrency(filterByCurrency(credit?.calc_currencies, id))
                      setSumDownPayment(0)
                    }}
                  >
                    {filtered?.map((item) => (
                      <option key={item.id} id={item?.currency?.code} value={item?.currency?.id}>
                        {item?.currency?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={s.formItem} style={{ margin: '0' }}>
                <label className={clsx(s.formItemLabel, 'light-16', 'top-0')}>
                  {t('islamic_credit.term')}
                </label>
                <input
                  type="text"
                  value={`${term} ${t('calculator.month')}`}
                  readOnly
                  className={clsx(s.formItemInput, 'light-16', 'height-150', 'border-black')}
                />
                {availableTerms.length > 0 && (
                  <>
                    <div className={clsx(s.cuption, 'light-12')}>
                      <div className={clsx(s.from2, 'light-12')}>
                        {t('short.from')} {Math.min(...availableTerms)} {t('calculator.month')}
                      </div>
                      <div className={clsx(s.to2, 'light-12')}>
                        {t('short.till')} {Math.max(...availableTerms)} {t('calculator.month')}
                      </div>
                    </div>
                    <div className={s.slider}>
                      <div className="slider-container">
                        <ReactSlider
                          className="custom-slider"
                          min={Math.min(...availableTerms)}
                          max={Math.max(...availableTerms)}
                          value={term}
                          onChange={(val: number) => {
                            const closest = availableTerms.reduce((prev, curr) =>
                              Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev,
                            )
                            setTerm(closest)
                          }}
                          thumbClassName="custom-thumb"
                          trackClassName="custom-track"
                          step={1}
                          marks={availableTerms}
                          markClassName="example-mark"
                          renderMark={(props) => {
                            const isActive = availableTerms.includes(Number(props.key))
                            return isActive ? <span {...props} /> : null
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={s.calcGridRight}>
            <div className={s.result}>
              <div className={clsx(s.label, 'light-16')}>
                {t('islamic_credit.total_amount')}
              </div>
              <div className={s.value}>
                {formatNumber(totalAmount)?.includes("-") ? 0 : formatNumber(totalAmount)}
              </div>
            </div>

            <div className={s.result}>
              <div className={clsx(s.label, 'light-16')}>
                {t('islamic_credit.monthly_payment')}
              </div>
              <div className={s.value}>
                {formatNumber(monthlyPayment)?.includes("-") ? 0 : formatNumber(monthlyPayment)}
              </div>
            </div>

            <div className={s.result}>
              <div className={clsx(s.label, 'light-16')}>
                {t('islamic_credit.markup_rate')}
              </div>
              <div className={s.value}>
                {formatNumber((sum * Number(matchedPercent?.perc || 0)) / 100)?.includes("-") ? 0 :
                  ///@ts-ignore
                  formatNumber(((sum * Number(matchedPercent?.perc || 0)) / 100)?.toFixed(0))}
              </div>
            </div>
            {/*<p className={clsx(s.desc, 'light-16')}>{t('calculator.cuption')}</p>*/}
            <p className={clsx(s.desc, 'light-16')} style={{ marginTop: 10 }}>{t('calculator.cuption2')}</p>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default IslamicCreditCalculator
