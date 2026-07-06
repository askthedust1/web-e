import React, { FC, useEffect, useState } from 'react'
import style from './deteil-user.module.scss'
import Heading from 'components/Heading/Heading'
import Steps from 'components/Steps'

import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'

import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { IdentificationProps } from 'models/identification'
import { RskSelect } from 'components/ui/Select'
import { RscInput } from 'components/ui/Input'
import InputDataPicker from 'components/Input/InputDataPicker'
import CkSelectPhoto from 'components/CkSelectPhoto'
import { useTranslation } from 'next-i18next'
import { store } from '../../../../store'
import 'rc-drawer/assets/index.css';
import DrawerUI from 'components/ui/DrawerUI'
import ConsentForm from 'components/ui/ConsentForm'
import { IFileMortgage } from 'pages/online-service/savings-mortgage/index.page'

export interface FormDeteilUser {
  citizenship: string;
  seria_version: string;
  passport_seria: string;
  passport_organ: string;
  received_by: string;
  received_date: Date;
  end_date: Date;
  passport_front: File;
  passport_back: File;
  passport_selfie: File
}

interface Props {
  steps: string[]
  current: number
  formInfo: IdentificationProps
  onSubmitHandler(data: FormDeteilUser): void
  message?: string
  docs_mortgage: IFileMortgage[]
  goBack(): void
  setValueState: (value:any) => void
  value: FormDeteilUser
  personalData: {
    desc: string
    file?: string
    id: number
    slug: string
    title: string
  }
}
const DeteilUser: FC<Props> = ({
  steps,
  current,
  formInfo,
  onSubmitHandler,
  message: _message,
  goBack,
  personalData,
  value,
  setValueState,
  docs_mortgage
}) => {
  const {
    control,
    register,
    setValue,
    setError: _setError,
    handleSubmit,
    reset: _reset,
    watch: _watch,
    getValues,
    formState: { errors },
  } = useForm<FormDeteilUser>({
    mode: 'onChange',
  })
  const loadFileFront = (file: File) => {
    setValue('passport_front', file)
  }
  const loadFileSelfie = (file: File) => {
    setValue('passport_selfie', file)
  }
  const loadFileBack = (file: File) => {
    setValue('passport_back', file)
  }
  const onSubmit: SubmitHandler<FormDeteilUser> = (data) => {
    onSubmitHandler(data)
  }
  const _modals = store

  const { t } = useTranslation()
  const [isCheck, setIsCheck] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const [isCheckValue, setIsCheckValue] = useState<boolean>(false)
  const CITIZENSHIP = formInfo?.countries
  const SERIA_TYPES = formInfo?.seria_versions
  const ORGANS = formInfo?.organs


  const watcheResived = useWatch({ control, name: 'received_by' })

  useEffect(() => {
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        setValue(key as keyof FormDeteilUser, val);
      });
    }
  }, [value, setValue]);

  const isCheckHandler = () => {
    setOpen(prev => !prev);
  }

  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('savingsMortgage.title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={() => {
            setValueState(getValues())
            goBack()
          }} />
          <p className="medium-20"> Паспортные данные</p>
          <form action="" className={style.form}>
            <RskSelect
              {...register('citizenship', {
                required: t('forms.card.choose_citizenship'),
                setValueAs: (citizenship) => parseInt(citizenship) || null,
              })}
              optionsList={CITIZENSHIP}
              value={CITIZENSHIP?.length === 1 ? CITIZENSHIP[0].id : undefined}
              error={errors.citizenship}
              label={t('forms.card.choose_citizenship')}
            />
            <div className={style.row}>
              <div className={style.short}>
                <RskSelect
                  {...register('seria_version', {
                    required: t('savingsMortgage.series_version'),
                    setValueAs: (seria_version) =>
                      parseInt(seria_version) || null,
                  })}
                  optionsList={SERIA_TYPES}
                  error={errors.seria_version}
                />
              </div>
              <div className={style.medium}>
                <RscInput
                  error={errors.passport_seria}
                  label={t('savingsMortgage.passport_no')}
                  max={7}
                  type="number"
                  {...register('passport_seria', {
                    required: t('savingsMortgage.passport_no'),
                    pattern: {
                      value: /^[0-9]+$/,
                      message: t('savingsMortgage.only_numbers'),
                    },
                    minLength: {
                      value: 7,
                      message: t('savingsMortgage.passport_number'),
                    },
                    maxLength: {
                      value: 7,
                      message: t('savingsMortgage.passport_number'),
                    },
                  })}
                />
              </div>
            </div>
            <div className={style.row}>
              <div className={style.short}>
                <RskSelect
                  {...register('passport_organ', {
                    required: t('savingsMortgage.issuing_authority'),
                    setValueAs: (organ) => parseInt(organ) || null,
                  })}
                  optionsList={ORGANS}
                  error={errors.passport_organ}
                />
              </div>
              <div className={style.medium}>
                <RscInput
                  dontShowLabel
                  error={errors.received_by}
                  label={t('forms.identification.issued')}
                  {...register('received_by', {
                    required: t('forms.identification.issued'),
                  })}
                  value={watcheResived?.toUpperCase()}
                />
              </div>
            </div>
            <div className={style.rowTime}>
              <Controller
                {...register('received_date', {
                  required: value?.received_date ? false : t('forms.identification.date_from'),
                  // setValueAs: (country) => parseInt(country) || null,
                })}
                name="received_date"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    placeholder={t('forms.identification.date_from')}
                    onChange={(date: Date) => {
                      field.onChange(date)
                      const newEndDate = new Date(date)
                      newEndDate.setFullYear(newEndDate.getFullYear() + 10)

                      setValueState({
                        ...getValues(),
                        end_date: newEndDate,
                      })
                    }}
                    selected={field.value || value?.received_date}
                    error={errors.received_date}
                  />
                )}
              />

              <Controller
                {...register('end_date', {

                  // setValueAs: (country) => parseInt(country) || null,
                })}
                name="end_date"
                control={control}
                render={({ field }) => (
                  <InputDataPicker
                    placeholder={t('forms.identification.date_till')}
                    onChange={(date: Date) => field.onChange(date)}
                    selected={value?.end_date}
                    disabled
                    isOpenDate
                    error={errors.end_date}
                  />
                )}
              />

            </div>
            <div className={style.photoWrapper}>
              <Controller
                control={control}
                name="passport_front"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_front', {
                      required: t('savingsMortgage.upload_passport'),
                    })}
                    label={t('savingsMortgage.upload_passport')}
                    fileTypes={['JPG', 'PNG', 'HEIC', 'TIFF', 'MOV', 'JPEG']}
                    onChangeFiles={loadFileFront}
                    error={errors?.passport_front}
                  />
                )}
              />
              <Controller
                control={control}
                name="passport_back"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_back', {
                      required: t('forms.card.image_loader'),
                    })}
                    label={t('forms.card.image_loader')}
                    fileTypes={['JPG', 'PNG', 'HEIC', 'TIFF', 'MOV', 'JPEG']}
                    onChangeFiles={loadFileBack}
                    error={errors?.passport_back}
                  />
                )}
              />
            </div>
            <div className={style.passport_selfie}>
              <Controller
                control={control}
                name="passport_selfie"
                render={() => (
                  <CkSelectPhoto
                    {...register('passport_selfie', {
                      required: t('savingsMortgage.upload_yourself_passport'),
                    })}
                    label={t('savingsMortgage.upload_yourself_passport')}
                    fileTypes={['JPG', 'PNG', 'HEIC', 'TIFF', 'MOV', 'JPEG']}
                    onChangeFiles={loadFileSelfie}
                    error={errors?.passport_selfie}
                  />
                )}
              />
            </div>
            <div className={style.button}>
              <Button
                onClick={() => {
                  setValueState(getValues())
                  goBack()
                }}
                value={'Назад'}
                isLarge
                isLong
              />
            </div>
            <div  style={{ height: 40, display: 'flex', alignItems: 'start', marginTop: 30, marginBottom: 10 }}>
              <div style={{ marginRight: 10 }}>
                <input type="checkbox" id="scales2" name="scales2" checked={isCheckValue}
                       onChange={() => setIsCheckValue((prev) => !prev)}
                       className={style.inputCheckbox} />
              </div>
              <label className={`light-12`} htmlFor="scales2">
                {t("offer.text_first_docs")} <a target="_blank"
                                 href={docs_mortgage?.length ? docs_mortgage[0].file : ""}
                                 className={style.link}
                                 rel="noreferrer">
                {t("offer.text_link")}
              </a> {t("offer.text_first_docs_2")}
                <a target="_blank"
                   href={docs_mortgage?.length ? docs_mortgage[0].file : ""}
                   className={style.link}
                   rel="noreferrer"> {t("offer.text_link_2")} </a>
                ) {t("offer.text_first_docs_3")}
              </label>
            </div>
            <div className={style.info}>
              <span style={{ marginRight: 10 }}><input type="checkbox" id="scales" name="scales" checked={isCheck}
                                                       onChange={isCheckHandler}
                                                       className={style.inputCheckbox} /></span>
              <label className={`${style.title} light-12  `} htmlFor="scales">
                {t('forms.personal_data_mort.first')}{' '}
                <a
                  target="_blank"
                  href={docs_mortgage?.length >= 1 ? docs_mortgage[1].file : personalData.file}
                  className={style.link}
                  rel="noreferrer"
                >
                  {t('forms.personal_data_mort.second')}
                </a>
              </label>
              <div className={style.button}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  value={t('setting.button_request')}
                  isLarge
                  disabled={!isCheck}
                  isLong
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={style.part}>
        <div>
          <CardInfoBig info='
          <section>
  <h4 style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 15px;">Накопительная ипотека — ваш удобный путь к жилью мечты</h4>
  <p style="line-height: 1.6; margin-bottom: 20px;">Наш продукт "Накопительная ипотека" предназначен для того, чтобы помочь вам накопить средства на первоначальный взнос для покупки жилья. С его помощью вы сможете накапливать постепенно, выплачивая удобные фиксированные взносы.</p>

  <h2 style="font-size: 1.5rem; margin-top: 20px; margin-bottom: 10px; color: #000;">Как это работает:</h2>
  <ul>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Оценочная стоимость жилья:</strong> Вы выбираете стоимость жилья, например 4 000 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Цель накоплений:</strong> Вам нужно накопить 30% от стоимости жилья, что в данном случае составляет 1 200 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Первоначальный взнос:</strong> Сначала вносится минимальный платеж, например 10 000 сом.</li>
    <li style="margin-bottom: 10px;"><strong style="color: #000;">Ежемесячные накопления:</strong> Оставшаяся сумма будет выплачиваться в течение 24 месяцев, что составит около 49 583 сом в месяц.</li>
  </ul>

  <p style="line-height: 1.6; margin-bottom: 20px;">Это удобный и планомерный способ накопить средства на первоначальный взнос, чтобы вы могли начать движение к своей мечте о собственном жилье.</p>
</section>
' />
        </div>
        <div style={{ marginTop: 30 }}>
          <CardInfoBig info={`
         <div>
  <h4 style="color: #1a73e8; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
    ${t("savingsMortgage.requirements_identification")}
  </h2>
  
  <div class="step" style="margin-bottom: 30px;">
    <div class="step-title" style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">
      1. ${t("savingsMortgage.the_blurry")}
    </div>
  </div>

  <div class="step" style="margin-bottom: 30px;">
    <div class="step-title" style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">
      2. ${t("savingsMortgage.your_hands")}
    </div>
  </div>

  <div class="step" style="margin-bottom: 30px;">
    <div class="step-title" style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">
      3. ${t("savingsMortgage.the_allowed")}
    </div>
  </div>

  <div class="step" style="margin-bottom: 30px;">
    <div class="step-title" style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">
      4. ${t("savingsMortgage.the_passport")}
    </div>
  </div>
</div>

          `} />
        </div>
      </div>
      <DrawerUI
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        width="100%"
      >
        <div>
          <ConsentForm onClose={() => {
            setOpen(false)
            setIsCheck(false)
          }} onCheck={() => {
            setOpen(false)
            setIsCheck(true)
          }}/>
        </div>
      </DrawerUI>
    </div>
  )
}

export default DeteilUser
