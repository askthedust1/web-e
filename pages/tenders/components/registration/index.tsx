import React, { FC, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import HeadingWithNav from 'components/Heading/Heading'
import clsx from 'clsx'
import Button from 'components/Buttons/Button'
import { UserApi } from 'services/api/UsersApiModule'
import { EMAIL_SINX } from 'helpers/email-sinx'
import PopUp from 'components/PopUp'
import ResultModal from 'components/ResultModal'
import s from './registration.module.scss'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { store } from 'store'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'
import { InputPhoneInternational } from 'components/Input/InputPhoneInternational'

export interface RegistrationProps {
  username: string
  email: string
  fio: string
  phone: string
  inn: string
  company: string
  password: string
  re_password: string
  recaptcha?: string
}

interface Props {
  closePopup(): void

  getUserToken(): void

  loginShow(): void
}

const RegistrationForm: FC<Props> = ({ closePopup, loginShow }) => {
  const [popUp, setPopUp] = useState({
    show: false,
    text: [],
    popUpShow: false,
  })
  const { modals } = store
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const {
    control,
    register,
    setValue,
    setError: _setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationProps>({
    mode: 'onChange',
  })

  const ErrorHendler = (errorData: any) => {
    setPopUp({
      show: true,
      text: errorData[Object.keys(errorData)[0]],
      popUpShow: false,
    })
  }

  const onSubmit = async (reg: RegistrationProps) => {
    setLoader(true)
    const token = await getReCaptchaKey()
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <ResultModal
            success={false}
            message="Ошибка рекапчи"
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return null
    }
    const currentData = { ...reg, recaptcha: token }
    try {
      setLoader(true)
      const _registration = await UserApi.postUsers(currentData)
      setPopUp((prev) => ({ ...prev, popUpShow: true, text: [] }))
      setLoader(false)
    } catch (error: any) {
      ErrorHendler(error?.response?.data)
      setLoader(false)
    }
  }

  const popUpButton = () => {
    closePopup()
    loginShow()
  }

  const watchUser = useWatch({ control, name: 'username' })
  const watchemail = useWatch({ control, name: 'email' })
  const watchFio = useWatch({ control, name: 'fio' })
  const watchInn = useWatch({ control, name: 'inn' })
  const watchCompany = useWatch({ control, name: 'company' })
  const watchre_password = useWatch({ control, name: 're_password' })
  const watchpassword = useWatch({ control, name: 'password' })
  const loginValue = watchUser?.toLowerCase()

  return (
    <>
      {popUp.popUpShow && (
        <PopUp
          closeModal={() => setPopUp({ ...popUp, popUpShow: false })}
          text={t('successful_registration')}
          popUpButton={popUpButton}
        />
      )}
      <div className={s.wrapper}>
        <div className={s.overlay} onClick={closePopup}></div>
        <form className={s.form}>
          <HeadingWithNav title={t('tender_page.tender_reg')} />
          <p className={clsx(s.subTitle, 'light-18')}>{t('auth_caption')}</p>

          <div className={s.input}>
            <RscInput
              value={watchCompany}
              {...register('company', {
                required: t('name_of_organ'),
              })}
              error={errors.company}
              label={t('name_of_organ')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              value={watchFio}
              {...register('fio', {
                required: `${t('forms.card.input')}  ${t('forms.card.fio')}`,
              })}
              error={errors.fio}
              label={t('forms.card.fio')}
            />
          </div>
          <div className={s.input} style={{ margin: '15px 0' }}>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: t('forms.card.input') + t('forms.card.phone'),
                minLength: {
                  value: 11,
                  message: t('forms.card.phone_error'),
                },
              }}
              render={({ field: { value } }) => {
                return (
                  <InputPhoneInternational
                    placeholder={t('forms.card.phone')}
                    error={errors.phone}
                    color="#f3f4f6"
                    onChangePhone={(phone: string) => {
                      setValue('phone', phone, { shouldValidate: true })
                    }}
                    value={value || ''}
                  />
                )
              }}
            />
          </div>
          <div className={s.input}>
            <RscInput
              value={watchemail}
              {...register('email', {
                required: t('contacts.email'),
                pattern: {
                  value: EMAIL_SINX,
                  message: t('forms.card.email_error'),
                },
              })}
              error={errors.email}
              label={t('contacts.email')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              maxLength={MAX_INN_LENGTH}
              type="tel"
              value={watchInn}
              {...register('inn', {
                minLength: {
                  value: 8,
                  message: t('forms.card.inn_error'),
                },
                pattern: {
                  value: /^\d+$/,
                  message: t('forms.card.inn_error'),
                },
                required: t('forms.card.inn'),
              })}
              error={errors.inn}
              label={t('forms.card.inn')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              {...register('username', {
                required: `${t('forms.card.input')} ${t(
                  'tender_page.login_title'
                )}`,
              })}
              error={errors.username}
              label={t('tender_page.login_title')}
              value={loginValue}
            />
          </div>
          <div className={s.input}>
            <RscInput
              autoComplete="new-password"
              isPasspord
              value={watchpassword}
              {...register('password', {
                required: `${t('forms.card.input')} ${t(
                  'tender_page.passwport_title'
                )}`,
              })}
              error={errors.password}
              label={t('tender_page.passwport_title')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              autoComplete="new-password"
              isPasspord
              {...register('re_password', {
                required: t('tender_page.confirm_password'),
              })}
              error={errors.re_password}
              label={t('tender_page.confirm_password')}
              value={watchre_password}
            />
          </div>
          {popUp?.show &&
            popUp?.text?.map((item, index) => (
              <p key={index} className={s.cuption}>
                *{item}
              </p>
            ))}

          <Button
            isLoading={loader}
            onClick={handleSubmit(onSubmit)}
            value={t('forms.card.button_send')}
            isLong
          />
        </form>
      </div>
    </>
  )
}

export default RegistrationForm
