import React, { useState, FC } from 'react'
import { store } from 'store'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import HeadingWithNav from 'components/Heading/Heading'
import { UserApi } from 'services/api/UsersApiModule'
import Container from 'components/Container'
import Button from 'components/Buttons/Button'
import PopUp from 'components/PopUp'
import { EMAIL_SINX } from 'helpers/email-sinx'
import s from './profile.module.scss'
import Loader from 'components/Loader'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'
import { InputPhoneInternational } from 'components/Input/InputPhoneInternational'

interface RegistrationProps {
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
  userToken: string | null | boolean
  data: {
    company: string
    email: string
    fio: string
    id: number
    inn: string
    phone: string
    username: string
  } | null
}
const Profile: FC<Props> = ({ data, userToken }) => {
  const { modals } = store
  const [toggleBtn, setToggleBtn] = useState(false)
  const [loader, setLoader] = useState(false)
  const { t } = useTranslation()
  const {
    control,
    register,
    setValue,
    setError: _setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationProps>({
    mode: 'onChange',
    defaultValues: {
      email: data?.email,
      fio: data?.fio,
      inn: data?.inn,
      company: data?.company,
      phone: data?.phone,
      username: data?.username,
    },
  })

  const watchemail = useWatch({ control, name: 'email' })
  const watchfio = useWatch({ control, name: 'fio' })
  const watchINN = useWatch({ control, name: 'inn' })
  const watchCompany = useWatch({ control, name: 'company' })
  const onSubmit = async (newData: RegistrationProps) => {
    setLoader(true)
    const token = await getReCaptchaKey();
    if (!token) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp
            text="Ошибка рекапчи"
            closeModal={() => modals?.resetData()}
          />
        ),
      })
      return null
    }
    const currentData = {
      ...newData,
      recaptcha: token,
    }
    try {
      UserApi.editUserPrifle(currentData, userToken as string)
        .then((_res) => {
          setToggleBtn(false)
          modals?.openModal({
            body: (
              <PopUp
                closeModal={() => modals?.resetData()}
                text={t('tender_page.change_profile')}
              />
            ),
          })
          setLoader(false)
        })
        .catch((_error) => {
          setLoader(false)
          modals?.openModal({
            body: (
              <PopUp
                closeModal={() => modals?.resetData()}
                text={t('tender_page.error')}
              />
            ),
          })
        })
    } catch (e) {
      setLoader(false)
    }
  }



  return (
    <>
      {loader && <Loader />}
      <Container>
        <form className={s.form}>
          <HeadingWithNav title={t('tender_page.my_profile')} />

          <RscInput
            disabled={!toggleBtn}
            error={errors.fio}
            label={t('forms.card.fio')}
            {...register('fio', {
              required: t('forms.card.input') + t('forms.card.fio'),
            })}
            type="string"
            value={watchfio}
          />
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
                  disabled={!toggleBtn}
                  onChangePhone={(phone: string) => {
                    setValue('phone', phone, { shouldValidate: true })
                  }}
                  value={value || ''}
                />
              )
            }}
          />
          <RscInput
            disabled={!toggleBtn}
            value={watchemail}
            label={t('contacts.email')}
            placeholder={t('forms.contacts.email')}
            {...register('email', {
              required: t('forms.card.input ') + t('forms.contacts.email'),
              pattern: {
                value: EMAIL_SINX,
                message: t('forms.card.email_error'),
              },
            })}
            error={errors.email}
          />
          <RscInput
            disabled={!toggleBtn}
            value={watchINN}
            maxLength={MAX_INN_LENGTH}
              type="tel"
            error={errors.inn}
            label={t('forms.card.inn')}
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
          />
          <RscInput
            disabled={!toggleBtn}
            error={errors.company}
            label={t('tender_page.name_of_organ')}
            {...register('company', {
              required: t('name_of_organ'),
            })}
            type="string"
            value={watchCompany}
          />
          {toggleBtn ? (
            <Button
              onClick={handleSubmit(onSubmit)}
              value={t('tender_page.save')}
            />
          ) : (
            <Button
              isLoading={loader}
              onClick={() => setToggleBtn(true)}
              isOutline
              value={t('tender_page.edit')}
            />
          )}
        </form>
      </Container>
    </>
  )
}

export default Profile
