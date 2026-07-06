import { FC, MouseEvent, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import Container from 'components/Container'
import HeadingWithNav from 'components/Heading/Heading'
import { RscInput } from 'components/ui/Input'
import CkDownloundFiles from 'components/CkDownloundFiles'
import Button from 'components/Buttons/Button'
import { deleteTenderApp } from 'components/TableTender'
import { TenderAppliction } from 'services/api/TendersModule'
import s from './reuest.module.scss'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { store } from 'store'
import ResultModal from 'components/ResultModal'

interface RequestTenderProps {
  message: string
  tender: number
  application: number
  file: File[] | any
  recaptcha: string
}
interface Props {
  userToken: string | boolean | null
  onSubmitTender(data: RequestTenderProps): void
  onEditHendler(data: RequestTenderProps, id: number): void
  getUserDataByToken(): void
  initValue?: TenderAppliction | null | any
  setLoader(state: boolean): void
}
const RequestTender: FC<Props> = ({
  onSubmitTender,
  initValue,
  userToken,
  onEditHendler,
  getUserDataByToken,
  setLoader,
}) => {
  const [isEdit, setIsEdit] = useState(true)
  const { modals } = store
  const {
    control,
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    clearErrors,
    formState,
  } = useForm<RequestTenderProps>({
    mode: 'onChange',
    defaultValues: { message: initValue?.message ? initValue?.message : '' },
  })

  const watchMessage = useWatch({ control, name: 'message' })
  const { t } = useTranslation()
  const loadFiles = (file: File[]) => {
    setValue('file', file)
  }
  const formData = getValues()
  const onSubmit = async (data: RequestTenderProps) => {
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
    data.recaptcha = token
    onSubmitTender(data)
  }

  const editTenderApplication = async () => {
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

    const formData = getValues()
    formData.recaptcha = token

    if (formData?.message.length !== 0 && formData.file.length !== 0) {
      onEditHendler(formData, initValue?.id)
      setIsEdit(!isEdit)
      clearErrors('file')
      clearErrors('message')
    } else {
      setError('file', {
        type: 'custom',
        message: t('forms.card.button_loader_title'),
      })
      setError('message', {
        type: 'custom',
        message: t('forms.card.input') + t('tender_page.message'),
      })
    }
  }
  const deleteTenderAppLiaction = (e: MouseEvent<HTMLElement>) => {
    deleteTenderApp(initValue?.id, e, userToken as string, getUserDataByToken, {
      leftText: t('tender_page.yes'),
      righText: t('tender_page.no'),
      title: t('tender_page.delete_caption'),
      error_popup: t('tender_page.error'),
    })
  }

  const title = initValue ? t('your_application') : t('tender_page.do_reuest')
  const cuption = initValue ? (
    <p className={s.colorBlue}>{t('application_submitted')}</p>
  ) : (
    <p className={`${s.title} light-12  `}>
      {t('forms.personal_data.first')}{' '}
      <a
        target="_blank"
        // href={owerdraftInfo?.page.personal_data_processing.file}
        className={s.link}
        rel="noreferrer"
      >
        {t('forms.personal_data.second')}
      </a>
    </p>
  )

  useEffect(() => {
    setIsEdit(initValue ? true : false)
    setValue('message', initValue?.message ? initValue?.message : '')
  }, [initValue])

  const showButtons = initValue ? (
    <div className={s.buttomWraper}>
      <Button
        className={'color-white'}
        isLong
        isBlue
        value={t('call_off')}
        onClick={(e) => deleteTenderAppLiaction(e)}
      />
      {isEdit ? (
        <Button
          isOutline
          className={s.button__edit}
          isLong
          value={t('tender_page.edit')}
          onClick={(_e) => setIsEdit(!isEdit)}
        />
      ) : (
        <Button
          disabled={!formData?.file?.length ? true : false}
          className={s.button__edit}
          isLong
          value={t('tender_page.save')}
          onClick={(_e) => {
            editTenderApplication()
          }}
        />
      )}
    </div>
  ) : (
    <Button
      isLong
      value={t('forms.card.button_send')}
      onClick={handleSubmit(onSubmit)}
    />
  )
  return (
    <Container>
      <HeadingWithNav title={title} />
      <form className={s.wrapper}>
        <div>
          <RscInput
            disabled={isEdit}
            value={watchMessage}
            error={formState?.errors.message}
            label={t('tender_page.message')}
            {...register('message', {
              required: t('forms.card.input') + t('tender_page.message'),
            })}
            type="string"
          />
          {showButtons}
          <div className={s.cuption}>{cuption}</div>
        </div>
        <Controller
          control={control}
          name="file"
          render={() => (
            <CkDownloundFiles
              clearErrors={clearErrors}
              setError={setError}
              isEdit={isEdit}
              initValue={initValue ? initValue?.docs : []}
              setFiles={loadFiles}
              {...register('file', {
                required: t('forms.card.button_loader_title'),
              })}
              error={formState?.errors?.file}
            />
          )}
        />
      </form>
    </Container>
  )
}

export default RequestTender
