import React, { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { RscInput } from 'components/ui/Input'
import { useTranslation } from 'next-i18next'
import HeadingWithNav from 'components/Heading/Heading'
import { InputPhone } from 'components/Input/InputPhone'
import Button from 'components/Buttons/Button'
import { EMAIL_SINX } from 'helpers/email-sinx'
import PopUp from 'components/PopUp'
import s from './complaint.module.scss'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'
import { store } from 'store'
import { Textarea } from 'components/ui/Textarea'
import { TenderAppliction, TendersApi } from 'services/api/TendersModule'
import CkDownloundFiles from 'components/CkDownloundFiles'
import { MAX_INN_LENGTH } from 'constants/max_inn_length'


export interface ComplaintProps {
  tenderId?: string
  fio: string
  email: string
  phone: string
  message: string
  inn: string
  company: string
  file?: File[] | any
  recaptcha?: string
}

interface Props {
  closePopup(): void,
  tenderId: number,
  userToken?: string,
  initValue?: TenderAppliction | null | any
  onComplaintSuccess?(): void
}

const ComplaintForm: FC<Props> = ({ closePopup, tenderId, userToken, initValue, onComplaintSuccess }) => {
  const [popUp, _setPopUp] = useState({
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
    clearErrors,
    setError,
    handleSubmit,
    formState,
  } = useForm<ComplaintProps>({
    mode: 'onChange',
      defaultValues: {
      message: initValue?.message ? initValue?.message : '',
      email: initValue?.email ? initValue.email : '',
      fio: initValue?.fio ? initValue.fio : '',
      inn: initValue?.inn ? initValue.inn : '',
      company: initValue?.company ? initValue.company : '',
      phone: initValue?.phone ? initValue.phone : '',
    },
  })

  const loadFiles = (file: File[]) => {
    setValue('file', file)
  }

    const handleSubmitForm = async (reg: ComplaintProps) => {
      setLoader(true);
      const token = await getReCaptchaKey();
      if (!token) {
        setLoader(false);
        modals.openModal({
          body: <PopUp text="Ошибка рекапчи" closeModal={() => modals?.resetData()} />,
        });
        return;
      }
      try {
        const { file, ...requestData } = reg;
        const requestPayload = { ...requestData, recaptcha: token, tender: tenderId };
        await TendersApi.postTenderComplaints(requestPayload, userToken as string)
          .then(async (res) => {
          try {
            await onSubmitTenderComplaints(file, res?.data?.id)
            setLoader(false)
            modals?.openModal({
              body: <PopUp text={t('tender_page.complaint_success')} closeModal={() => modals?.resetData()} />,
            })
            if (onComplaintSuccess) onComplaintSuccess();
            closePopup();
          } catch (e:any) {
            setLoader(false)
            modals.openModal({
              body: (
                <PopUp
                  text={e?.response?.data?.detail || t('error_popup')}
                  closeModal={() => modals?.resetData()}
                />
              ),
            })
            return;
          }
        })
      } catch (e:any) {
        setLoader(false)
        modals.openModal({
          body: (
            <PopUp
              text={e?.response?.data?.detail || t('error_popup')}
              closeModal={() => modals?.resetData()}
            />
          ),
        })
      } finally {
        setLoader(false)
      }
  };

  const onSubmitTenderComplaints = async (files: File[], id: number) => {
    try {
      return await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('claim', String(id));
          formData.append('file', file);
          return await TendersApi.postTenderFilesComplaints(formData, userToken as string);
        })
      );
    } catch (e: any) {
      modals.openModal({
        body: (
          <PopUp
            text={e?.response?.data?.detail || t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    }
  };

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.overlay} onClick={closePopup}></div>
        <form className={s.form}>
          <HeadingWithNav title={t('tender_page.complaint_form')} />
          <div className={s.input}>
            <RscInput
              {...register('fio', {
                required: t('forms.card.input') + t('forms.card.fio'),
              })}
              error={formState?.errors.fio}
              label={t('forms.card.fio')}
            />
          </div>
          <div className={s.input}>
            <Controller
              control={control}
              name="phone"
              rules={{
                required: t('forms.card.input') + t('forms.card.phone'),
                minLength: {
                  value: 13,
                  message: t('forms.card.phone_error'),
                },
              }}
              render={({ field: { value } }) => {
                return (
                  <InputPhone
                    dontShowLabel={false}
                    placeholder={t('forms.card.phone')}
                    label={t('forms.card.phone')}
                    error={formState?.errors.phone}
                    value={value}
                    onChangePhone={(event) => {
                      setValue('phone', event.formattedPhone)
                      setError('phone', {
                        message: '',
                      })
                    }}
                  />
                )
              }}
            />
          </div>
          <div className={s.input}>
            <RscInput
              {...register('company', {
                required: t('name_of_organ'),
              })}
              error={formState?.errors.company}
              label={t('name_of_organ')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              maxLength={MAX_INN_LENGTH}
              type="tel"
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
              error={formState?.errors.inn}
              label={t('forms.card.inn')}
            />
          </div>
          <div className={s.input}>
            <RscInput
              {...register('email', {
                required: t('contacts.email'),
                pattern: {
                  value: EMAIL_SINX,
                  message: t('forms.card.email_error'),
                },
              })}
              error={formState?.errors.email}
              label={t('contacts.email')}
            />
          </div>
          <Textarea
            label={t("tender_page.complaint_message")}
            error={formState?.errors.message}
            {...register('message', {
              required: "Оставьте свое сообщение",
            })}
          />
          <div>
            <label className={s.label}>
              {t("tender_page.complaint_file")}
            </label>
            <Controller
              control={control}
              name="file"
              render={() => (
                <CkDownloundFiles
                  clearErrors={clearErrors}
                  setError={setError}
                  isEdit={false}
                  initValue={[]}
                  setFiles={loadFiles}
                  customStyle={{ maxWidth: '100%', width: '100%' }}
                  {...register('file')}
                  error={formState?.errors?.file}
                />
              )}
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
            onClick={handleSubmit((reg) => handleSubmitForm(reg))}
            value={t('forms.card.button_send')}
            isLong
          />
        </form>
      </div>
    </>
  )
}

export default ComplaintForm
