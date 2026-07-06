import Steps from 'components/Steps'
import React, { FC } from 'react'
import style from './request-order.module.scss'
import Heading from 'components/Heading/Heading'
import { SubmitHandler, useForm } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import Button from 'components/Buttons/Button'
import CardInfoBig from 'components/Cards/CardInfoBig'
import { useTranslation } from 'next-i18next'

export interface RequestOrderProps {
  fio: string
  recaptcha?: string
}
export interface FormRequestOrderProps {
  name: string
  surname: string
  patronymic: string
  recaptcha?: string
}
interface Props {
  onSubmitHandler(data: RequestOrderProps): void
  current: number
  steps: string[]
  message?: string
  goBack(): void
}

const RequestOrder: FC<Props> = ({
  onSubmitHandler,
  current,
  steps,
  message,
  goBack,
}) => {
  const { t } = useTranslation()
  const {
    control: _control,
    register,
    setValue: _setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRequestOrderProps>({
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<FormRequestOrderProps> = (data) => {
    const currentData = {
      fio: data.name + ' ' + data.surname + ' ' + data.patronymic,
    }

    onSubmitHandler(currentData)
  }

  return (
    <div className={style.container}>
      <div className={style.part}>
        <Heading title={t('forms.identification.main_title')} />
        <div className={style.block}>
          <Steps steps={steps} current={current} goBack={goBack} />
          <form action="" className={style.form}>
            <RscInput
              error={errors.name}
              label={t('forms.identification.name')}
              {...register('name', {
                required: t('forms.identification.name'),
              })}
            />
            <RscInput
              error={errors.surname}
              label={t('forms.identification.surname')}
              {...register('surname', {
                required: t('forms.identification.surname'),
              })}
            />
            <RscInput
              error={errors.patronymic}
              label={t('forms.identification.patronymic')}
              {...register('patronymic', {
                required: t('forms.identification.patronymic'),
              })}
            />
            <div className={style.info}>
              <div className={style.button}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  value={t('forms.card.continue')}
                  isLarge
                  isLong
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={style.part}>
        <div>
          <CardInfoBig info={message} />
        </div>
      </div>
    </div>
  )
}

export default RequestOrder
