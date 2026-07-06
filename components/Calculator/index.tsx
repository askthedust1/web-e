import Heading from 'components/Heading/Heading'
import Section from 'components/Section'
import Container from 'components/Container'
import s from './calc.module.scss'
import { NumericFormat } from 'react-number-format'
import { useState, FC, memo, useMemo } from 'react'
// @ts-ignore
// import Slider from 'react-rangeslider'
import { useTranslation } from 'next-i18next'
import {calculateDeposite, calculateDeposite2, creditsCalculator} from 'helpers/calculators'
import { useDebounce } from 'helpers/debounce'
import { TimeFormatEnum } from 'pages/calculator/index.page'
import clsx from 'clsx'
import ReactSlider from 'react-slider'

import {useRouter} from "next/router";

interface Props {
  calcCurrencies: {
    calc_percents: {
      id: number
      period: {
        end: number
        id: number
        measure: string
        start: number
      }
      perc: string
      step: number
    }[]
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    min_sum: number
    max_sum: number
  }[]

  isCredit?: boolean
}

const Calculator: FC<Props> = ({ calcCurrencies, isCredit = false }) => {
  const { t } = useTranslation()
  const [sum, setSum] = useState<number>(calcCurrencies[0]?.min_sum || 0)
  const router: any = useRouter()

  const [currencies, setCurrencies] = useState<number>(
    calcCurrencies[0]?.currency.id
  )

  const currentCurr = calcCurrencies.filter(
    (item) => item.currency.id === currencies
  )[0]
  const [month, setMonth] = useState<number>(
    currentCurr?.calc_percents[0]?.period.start || 0
  )

  const onChangeCarr = (e: string) => {
    setSum(0)
    setCurrencies(parseInt(e))
    setMonth(currentCurr?.calc_percents[0]?.period.start || 0)
  }
  const calcPercents = currentCurr?.calc_percents
  const max_time = currentCurr?.calc_percents?.slice(-1)[0]?.period.end
  const currentMont =
    currentCurr?.calc_percents?.filter(
      (item) => item?.period?.start <= month && item?.period?.end >= month
    )[0] || currentCurr?.calc_percents[0]

  const _step = useMemo(
    function callback() {
      let step
      for (let i = 0; i <= currentCurr?.calc_percents?.length; i++) {
        if (currentCurr?.calc_percents[i]?.period?.end === month) {
          return (step = currentCurr?.calc_percents[i + 1]?.step)
        } else {
          return (step = currentMont?.step)
        }
      }
      return step
    },
    [month]
  )


  const depozitResult = router?.query?.slug?.includes("depozit-bakalaj-detskij") ?
      calculateDeposite2 (
          sum || 0,
          parseFloat(currentMont?.perc || '0'),
          month,
          currentMont?.period?.measure
      )
      : calculateDeposite(
    sum || 0,
    parseFloat(currentMont?.perc || '0'),
    month,
    currentMont?.period?.measure
  )

  const calculatorResult =
    currentMont &&
    isCredit &&
    creditsCalculator(
      month,
      parseFloat(currentMont?.perc || '0'),
      sum || 0,
      currentMont?.period?.measure
    )

  const percDepositValue =
    useDebounce(
      !currentMont?.perc
        ? currentCurr?.calc_percents[0]?.perc
        : currentMont?.perc || '0',
      250
    ) || 0

  const _summaValue =
    useDebounce(
      isCredit ? calculatorResult || '0' : depozitResult || '0',
      300
    ) || 0

  const timeFormat = currentMont?.period?.measure || ''
  const nextStepPeriud = (currentStep: number) => {
    const nextStep = calcPercents?.filter(
      (calc) =>
        calc?.period?.start <= currentStep && calc?.period?.end >= currentStep
    )[0]?.step

    if (nextStep === 1) {
      calcPercents?.forEach((percent) => {
        const period = percent.period

        if (period?.start <= currentStep && period?.end >= currentStep) {
          setMonth(currentStep)
        }
      })
    }

    if (nextStep > 1 || !nextStep) {
      const _currentPeriud = calcPercents.filter((percent) => {
        const period = percent.period
        if (period?.start <= currentStep && period?.end >= currentStep) {
          return period
        }
      })[0]?.period

      if (currentStep % nextStep === 0) {
        setMonth(currentStep)
      }
    }
  }

  const subtitleCuption = () => {
    switch (timeFormat) {
      case TimeFormatEnum.Day:
        return t('calculator.credit_subtitleDay')
      case TimeFormatEnum.Month:
        return t('calculator.credit_subtitle')
      case TimeFormatEnum.Year:
        return t('calculator.credit_subtitleYear')
    }
  }

  const ProcnetValues = useMemo(
    function callback() {
      const array = calcPercents?.map((element) => {
        const min = element?.period?.start
        const max = element?.period?.end
        const step = element?.step || 1
        
        let rangeValues = []
        for (let i = min; i <= max; i += step) {
          if (
            step >= 3 ||
            element?.period?.start === element?.period?.end ||
            i === element?.period?.end
          ) {
            rangeValues.push(i)
          }
        }
        return rangeValues
      })

      const arratTest = array.flat()
      let obj: {
        [x: number]: number
      } = {}
      arratTest?.forEach(function (item) {
        obj[item] = item
      })
      return obj
    },
    [currentCurr, month, sum, currencies]
  )

  const SliderWrapper = useMemo(
    function callback() {
      return (
        <>
        <ReactSlider
            marks={Object.values(ProcnetValues)}
            className="custom-slider"
            markClassName="example-mark"
            min={currentCurr?.calc_percents[0]?.period.start || 1}
            max={max_time}
            value={month}
            onChange={(val: number) => nextStepPeriud(val)}
            thumbClassName="custom-thumb"
            trackClassName="custom-track"
            // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
/>
        {/* <Slider
          labels={ProcnetValues}
          min={currentCurr?.calc_percents[0]?.period.start || 1}
          max={max_time}
          value={month}
          onChange={(val: number) => nextStepPeriud(val)}
          tooltip={false}
        /> */}
        </>
      )
    },
    [currentCurr, month, sum, currencies]
  )
  const handleChange = (e:any) => {
    const { value } = e.target;
    if (value === 0) {
      setSum(0);
    } else {
      const newValue = parseInt(value, 10);
      setSum(newValue);
    }
  };

  const handleBlur = () => {
    if (sum === 0 || isNaN(Number(sum))) {
      setSum(currentCurr?.min_sum);
      return;
    }
    let newValue = Number(sum);
    if (currentCurr?.min_sum !== undefined && newValue < currentCurr.min_sum) {
      newValue = currentCurr.min_sum;
    }
    if (currentCurr?.max_sum !== undefined && newValue > currentCurr.max_sum) {
      newValue = currentCurr.max_sum;
    }
    setSum(newValue);
  };

  return (
    <Section className={s.calc}>
      <Container>
        <Heading
          title={
            !isCredit
              ? t('calculator.main_title_dep')
              : t('calculator.main_title_cred')
          }
        />
        <div className={s.calcGrid}>
          <div className={s.calcGridLeft}>
            <div className={s.calcFormGrid}>
              <div className={s.formItem}>
                <label className={clsx(s.formItemLabel, 'light-12', 'top-0 ')}>
                  {!isCredit
                      ? t('calculator.deposit_amount')
                      : t('calculator.credit_amount')}
                </label>
                <input
                    type="number"
                    min={currentCurr?.min_sum}
                    max={currentCurr?.max_sum}
                    value={sum}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={clsx(
                        s.formItemInput,
                        'light-16',
                        'height-150',
                        'border-black'
                    )}
                />

                <div className={s.cuption}>
                  <div className={clsx(s.from, 'light-12')}>
                    {t('short.from')}-
                    {String(currentCurr?.min_sum).replace(
                        /(\d)(?=(\d\d\d)+([^\d]|$))/g,
                        '$1 '
                    )}
                  </div>
                  <div className={clsx(s.to, 'light-12')}>
                    {t('short.till')}-
                    {String(currentCurr?.max_sum).replace(
                        /(\d)(?=(\d\d\d)+([^\d]|$))/g,
                        '$1 '
                    )}
                  </div>
                </div>

                <div className={s.slider}>
                  <ReactSlider
                      className="custom-slider"
                      markClassName="example-mark"
                      min={currentCurr?.min_sum}
                      max={currentCurr?.max_sum}
                      value={sum || currentCurr?.min_sum}
                      onChange={(val: any) => setSum(val)}
                      thumbClassName="custom-thumb"
                      trackClassName="custom-track"
                  />
                  {/* <Slider
                    min={currentCurr?.min_sum}
                    max={currentCurr?.max_sum}
                    value={sum || currentCurr?.min_sum}
                    onChange={(val: any) => setSum(val)}
                    tooltip={false}
                    step={1}
                  /> */}
                </div>
              </div>
              <div className={s.formItem}>
                <select
                    className={clsx(
                        s.formItemSelect,
                        'light-16',
                        'height-150',
                        'border-black'
                    )}
                    onChange={(e) => onChangeCarr(e.target.value)}
                >
                  {calcCurrencies?.map((item) => (
                    <option key={item.id} value={item?.currency?.id}>
                      {item?.currency?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className={s.formItem}>
                <label className={clsx(s.formItemLabel, 'light-16', 'top-0 ')}>
                  {!isCredit
                    ? t('calculator.deposit_term')
                    : t('calculator.credit_time')}
                </label>
                <input
                  type="text"
                  value={month + '-' + t(`calculator.${timeFormat}`)}
                  readOnly
                  className={clsx(
                    s.formItemInput,
                    'light-16',
                    'height-150',
                    'border-black'
                  )}
                />
                <div className={clsx(s.cuption, 'light-12')}>
                  <div className={clsx(s.from2, 'light-12')}>
                    {t('short.from')}-
                    {currentCurr?.calc_percents[0]?.period.start}{' '}
                    {t(`calculator.${timeFormat}`)}
                  </div>
                  <div className={clsx(s.to2, 'light-12')}>
                    {' '}
                    {t('short.till')}-{max_time} {t(`calculator.${timeFormat}`)}
                  </div>
                </div>
                <div className={clsx(s.slider)}>{SliderWrapper}</div>
              </div>
            </div>
          </div>
          <div className={s.calcGridRight}>
            <div className={s.result}>
              <div className={clsx(s.label, 'light-16')}>
                {' '}
                {!isCredit
                  ? t('calculator.deposit_subtitle')
                  : subtitleCuption()}
              </div>
              <div className={s.value}>
                <p>
                  {
                    router?.query?.slug?.includes("depozit-bakalaj-detskij") ?
                        Number(Number(depozitResult || 0) - sum)?.toFixed(2) :
                    isCredit
                    ? String(calculatorResult).replace(
                    /(\d)(?=(\d\d\d)+([^\d]|$))/g,
                    '$1 '
                    ) || 0
                    : String(depozitResult).replace(
                    /(\d)(?=(\d\d\d)+([^\d]|$))/g,
                    router?.query?.slug?.includes("depozit-bakalaj-detskij") ? '' : '$1'
                    ) || 0
                  }
                </p>
              </div>
            </div>
            <div className={s.result}>
              <div className={clsx(s.label, 'light-16')}>{t('calculator.procet_payment')}</div>
              <div className={s.value}>
                <NumericFormat
                  value={percDepositValue || 0}
                  displayType={'text'}
                  decimalScale={2}
                />
                %
              </div>
            </div>
            <div className={s.result}></div>
            <p className={clsx(s.desc, 'light-16')}>{t('calculator.cuption')}</p>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default memo(Calculator)
