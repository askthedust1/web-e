import Steps from 'components/Steps'
import React, { FC, useEffect, useRef, useState } from 'react'
import style from './request-order.module.scss'
import Heading from 'components/Heading/Heading'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'

import { useTranslation } from 'next-i18next'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'

import { EMAIL_SINX } from '../../../../helpers/email-sinx'

import { InputPhoneInternational } from 'components/Input/InputPhoneInternational'
import Table from 'components/Table'
import { IdentificationApi } from 'services/api/Identification'
import { getValue, removeSpaces } from '../index.page'
import { toast } from 'react-toastify'
import { RscInputNumber } from 'components/ui/inputNumber'

export interface RequestOrderProps {
  fio: string
  recaptcha?: string
}
export interface FormRequestOrderProps {
  first_name: string;
  last_name: string;
  middle_name?: string;
  inn: string;
  deposit_term: number;
  first_deposit_amount: string;
  housing_estimated_value: string;
  phone: string;
  whatsapp?: string;
  email?: string;
}

interface Props {
  onSubmitHandler(data: FormRequestOrderProps): void
  current: number
  steps: string[]
  message?: string
  goBack(): void
  value: FormRequestOrderProps
  setValueState: (value:any) => void
}

export interface IGenerateSchedule {
  payment_number: number,
  payment_date: string,
  payment_amount: string,
  balance: string
}

export interface IScheduleContent {
  id: number,
  first: number,
  second: string,
  third: string,
  fourth: string
}

const RequestOrder: FC<Props> = ({
  onSubmitHandler,
  current,
  steps,
  message: _message,
  goBack,
  value,
  setValueState
}) => {
  const { t } = useTranslation()
  const {
    control,
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormRequestOrderProps>({
    mode: 'onChange',
  })
  const [scheduleData, setScheduleData] = useState<IGenerateSchedule[]>([])
  const scheduleRef = useRef<HTMLDivElement | null>(null);
  const deposit_term = useWatch({ control, name: 'deposit_term' })
  const [housing_estimated_value, setHousing_estimated_value] = useState<number>(0)
  const [first_deposit_amount, setFirst_deposit_amount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSize, setIsSize] = useState(false)
  const handlerGenerateSchedule = async (value: any) => {
    try {
      const {data} = await IdentificationApi.GenerateSchedulePost(value)
      setScheduleData(data)
      setError("first_deposit_amount", {type: 'number', message: ""})
      toast.info("График платежей успешно составлен. Пролистайте вниз, чтобы ознакомиться с деталями.")
    } catch (error:any) {
      if(error?.response?.status === 500) {
        setScheduleData([])
        setError("first_deposit_amount", {type: 'number', message: "Ошибка на сервере"})
      } else {
        setScheduleData([])
        setError("first_deposit_amount", {type: 'number', message: getValue(error?.response?.data)?.length ? getValue(error?.response?.data)[0] : "Ошибка на сервере"})
      }
      
    } 
  }
  useEffect(() => {
    if(value) {
      setHousing_estimated_value(Number(removeSpaces(value.housing_estimated_value)))
      setFirst_deposit_amount(Number(removeSpaces(value.first_deposit_amount)))
    }
  }, [])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (deposit_term && housing_estimated_value && first_deposit_amount) {
        handlerGenerateSchedule({
          deposit_term,
          housing_estimated_value,
          first_deposit_amount,
        });
      }
    }, 3000);

    return () => clearTimeout(delayDebounceFn); 
  }, [deposit_term, housing_estimated_value, first_deposit_amount]);
  const onSubmit: SubmitHandler<FormRequestOrderProps> = (data) => {
    const currentData = {
      ...data
    }

    onSubmitHandler(currentData)
  }

  useEffect(() => {
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        setValue(key as keyof FormRequestOrderProps, val);
      });
    }
    
  }, [value, setValue]);

  useEffect(() => {
    if (scheduleData.length > 0) {
      scheduleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [scheduleData]);

  const resetClick = async () => {
    setIsLoading(true)
    try {
      const {data} = await IdentificationApi.GenerateSchedulePost({
        deposit_term,
        housing_estimated_value,
        first_deposit_amount,
      } as any)
      setScheduleData(data)
      setError("first_deposit_amount", {type: 'number', message: ""})
      toast.info("График платежей успешно составлен. Пролистайте вниз, чтобы ознакомиться с деталями.")
      await setIsLoading(false)
    } catch (error:any) {
      await setIsLoading(false)
      if(error?.response?.status === 500) {
        setScheduleData([])
        toast.warning("Ошибка на сервере")
      } else {
        setScheduleData([])
        toast.warning(getValue(error?.response?.data)?.length ? getValue(error?.response?.data)[0] : "Ошибка на сервере")
      }

    }
  }

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.part}>
          <Heading title={t('savingsMortgage.title')} />
          <div className={style.block}>
            <Steps steps={steps} current={current} goBack={goBack} />
            <form action="" className={style.form}>
              <RscInput
                error={errors.first_name}
                label={t('feedback.name')}
                {...register('first_name', {
                  required: t('feedback.name'),
                })}
              />
              <RscInput
                error={errors.last_name}
                label={t('feedback.last_name')}
                {...register('last_name', {
                  required: t('forms.identification.surname'),
                })}
              />
              <RscInput
                error={errors.middle_name}
                label={t('feedback.patronymic')}
                {...register('middle_name')}
              />
              <RscInput
                error={errors.inn}
                max={14}
                label={t('forms.card.inn')}
                {...register('inn', {
                  minLength: {
                    value: MAX_INN_LENGTH,
                    message: 'ИНН должен содержать минимум ' + MAX_INN_LENGTH + ' символов',
                  },
                  required: 'ИНН обязателен для заполнения',
                  pattern: {
                    value: /^[12][0-9]*$/,
                    message: 'ИНН должен начинаться с цифры 1 или 2 и содержать только цифры',
                  },
                })}
                maxLength={MAX_INN_LENGTH}
                type="inn"
              />
              <p>{t('savingsMortgage.deposit_term')}</p>
              <RscInput
                min="0"
                max={360}
                error={errors.deposit_term}
                label={t('savingsMortgage.deposit_term')}
                {...register('deposit_term', {
                  required: t('Срок вклада (в месяцах)'),
                  max: {
                    value: 360,
                    message: t('savingsMortgage.deposit_term'),
                  },
                })}
                type="number"
              />
              <p>{t('savingsMortgage.amount_first_payment')}</p>
              <RscInputNumber
                min="0"
                error={errors.first_deposit_amount}
                isNumberFormat
                value={first_deposit_amount?.toString()}
                handleChangeNumber={(value) => setFirst_deposit_amount(Number(value))}
                label={' '}
                {...register('first_deposit_amount', {
                  required: t('savingsMortgage.amount_first_payment'),
                })}
                type="number"
              />
              <p>{t('savingsMortgage.approximate_purchased')}</p>
              <RscInputNumber
                error={errors.housing_estimated_value}
                min="0"
                isNumberFormat
                value={housing_estimated_value?.toString()}
                handleChangeNumber={(value) => setHousing_estimated_value(Number(value))}
                label={' '}
                {...register('housing_estimated_value', {
                  required: t('savingsMortgage.approximate_purchased'),
                })}
                type="number"
              />


              <p className="medium-20">
                {t('forms.identification.contact_data')}
              </p>
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <InputPhoneInternational
                  placeholder={t('forms.card.phone')}
                  onChangePhone={(phone) => setValueState((prev: any) => {
                    return {
                      ...prev,
                      phone: phone,
                    }
                  })}
                  value={value?.phone || ''}
                />
              </div>
              <div className={style.row}>
                <RscInput
                  error={errors.whatsapp}
                  label={t('contacts.whatsapp')}
                  {...register('whatsapp', {
                    required: "Введите whatsapp",
                  })}
                  isHalf
                  type="number"
                />
                <RscInput
                  label={t('contacts.email')}
                  placeholder={t('contacts.email')}
                  {...register('email', {
                    validate: {
                      noSpaces: value =>
                        value?.includes(' ') ? 'Email не должен содержать пробелы' : true,
                      isEmail: value =>
                        EMAIL_SINX.test(value || "") ? true : t('forms.card.email_error'),
                    },
                    required: 'Введите email',
                  })}
                  error={errors.email}
                  isHalf
                />
              </div>
              <div className={style.info}>
                {
                  (deposit_term && housing_estimated_value && first_deposit_amount) &&
                  <div className={style.button} style={{ marginRight: 20 }}>
                    <Button
                      isBlue
                      className={style.buttonText}
                      onClick={resetClick}
                      isLoading={isLoading}
                      value={t('calculate')}
                    />

                  </div>
                }

                <div className={style.button}>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    value={t('forms.card.continue')}
                    isLarge
                    disabled={!(scheduleData?.length && value?.phone?.length)}
                    isLong
                  />

                </div>

              </div>
            </form>
          </div>
        </div>
        <div className={style.part}>
          <div className={style.info_block}>
            <CardInfoBig info={`<section>
  <h4 style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 15px;">${t('savingsMortgage.mortgage_info_title')}</h4>
  <p style="line-height: 1.6; margin-bottom: 20px;">${t('savingsMortgage.mortgage_info_description')}</p>

  <h2 style="font-size: 1.5rem; margin-top: 20px; margin-bottom: 10px; color: #000;">${t('savingsMortgage.mortgage_info_how_it_works')}:</h2>
  <ul>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_house_price')}:</strong> ${t('savingsMortgage.mortgage_info_choose_price')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_aim')}:</strong>${t('savingsMortgage.mortgage_info_accumulate')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_down_payment')}:</strong> ${t('savingsMortgage.mortgage_info_min_payment')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_savings')}:</strong> ${t('savingsMortgage.mortgage_info_remaining_amount')}</li>
  </ul>

  <p style="line-height: 1.6; margin-bottom: 20px;">${t('savingsMortgage.mortgage_info_benefits')}</p>
</section>
`} />
          </div>
        </div>
      </div>
      <div className={style.part}>
        <div className={style.table} id='schedule' ref={scheduleRef}>
          {
            !!scheduleData?.length &&
            <div style={{
              boxShadow: "0px 0px 40px rgba(75, 91, 118, 0.1)",
              padding: 30,
              borderRadius: 16,
              marginBottom: 20
            }}>
              <h3 style={{ borderBottom: "0.5px solid #4c5c75", color: "#4c5c75", paddingBottom: 10 }}>Предварительный
                график платежей</h3>
              <Table title='' panels={[
                {
                  title: "№",
                  titleEn: "Номер платежа",
                  titleKg: "Номер платежа",
                  id: 1,
                },
                {
                  title: "Дата платежа",
                  titleEn: "Дата платежа",
                  titleKg: "Дата платежа",
                  id: 2
                },
                {
                  title: "Сумма платежа",
                  titleEn: "Сумма платежа",
                  titleKg: "Сумма платежа",
                  id: 3
                },
                {
                  title: "Баланс",
                  titleEn: "Баланс",
                  titleKg: "Баланс",
                  id: 4
                }
              ]} data={isSize ? scheduleData?.map((item, index) => {
                return {
                  id: index,
                  first: item.payment_number,
                  second: item.payment_date,
                  third: item.payment_amount,
                  fourh: item.balance
                }
              }) : scheduleData?.slice(0, 6).map((item, index) => {
                return {
                  id: index,
                  first: item.payment_number,
                  second: item.payment_date,
                  third: item.payment_amount,
                  fourh: item.balance
                }
              })} />
              <Button
                isOutline
                className={style.buttonTable}
                onClick={() => setIsSize(prev => !prev)}
                value={isSize ? t("collapse_chart") : t("expand_chart")}
                isLong
              />
            </div>
          }
        </div>
      </div>
      <div className={style.part}>
        <div className={style.info_block2}>
          <CardInfoBig info={`<section>
  <h4 style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 15px;">${t('savingsMortgage.mortgage_info_title')}</h4>
  <p style="line-height: 1.6; margin-bottom: 20px;">${t('savingsMortgage.mortgage_info_description')}</p>

  <h2 style="font-size: 1.5rem; margin-top: 20px; margin-bottom: 10px; color: #000;">${t('savingsMortgage.mortgage_info_how_it_works')}:</h2>
  <ul>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_house_price')}:</strong> ${t('savingsMortgage.mortgage_info_choose_price')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_aim')}:</strong>${t('savingsMortgage.mortgage_info_accumulate')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_down_payment')}:</strong> ${t('savingsMortgage.mortgage_info_min_payment')}.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">${t('savingsMortgage.mortgage_info_savings')}:</strong> ${t('savingsMortgage.mortgage_info_remaining_amount')}</li>
  </ul>

  <p style="line-height: 1.6; margin-bottom: 20px;">${t('savingsMortgage.mortgage_info_benefits')}</p>
</section>
`} />
        </div>
      </div>
    </div>
  )
}

export default RequestOrder
