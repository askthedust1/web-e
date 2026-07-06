import Button from 'components/Buttons/Button'
import CkSelectDocument from 'components/CkSelectDocument'
import Container from 'components/Container'
import Heading from 'components/Heading/Heading'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import PopUp from 'components/PopUp'
import { EMAIL_SINX } from 'helpers/email-sinx'
import { useTranslation } from 'next-i18next'
import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InfoApi } from 'services/api/InfoApi'
import { RscInput } from '../Input'
import s from './form-job.module.scss'
import { store } from 'store'
import { OtherPageApi } from 'services/api/OtherApi'
import { RskSelect } from 'components/ui/Select'
import { useRouter } from 'next/router'

interface JobProps {
  fk: number
  fio: string
  email: string
  phone: string
  file: File
  education_place: string
  practice_period: string
}

interface Props {
  vacancyId?: number
  onSuccess?: () => void
  locale?: string
  isPractice?: boolean
  isInternship?: boolean
}

const FormJob: FC<Props> = ({ vacancyId, onSuccess, locale, isPractice, isInternship }) => {
  const { t } = useTranslation()
  const { modals } = store
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<JobProps>({
    mode: 'onChange',
  })

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await OtherPageApi.getDepartmentsClient(locale || 'ru')
        setDepartments(response?.data || [])
      } catch (e) {
        setDepartments([])
      }
    }

    fetchDepartments()
  }, [])

  const onSubmit = async (data: JobProps) => {
    setIsLoading(true);
    const formData = new FormData();

    const type = isInternship
      ? 'internship'
      : isPractice
        ? 'practice'
        : 'general';
    formData.append('type', type);

    if (!vacancyId) {
      formData.append('fio', data.fio);
      formData.append('phone_number', data.phone);
      formData.append('email', data.email);
      formData.append('message', '');

      if (data.file) {
        formData.append('file', data.file);
      }

      if (data.fk) {
        formData.append('department', String(data.fk));
      }

      if (isPractice || isInternship) {
        formData.append('education_place', data.education_place || '');
        formData.append('practice_period', data.practice_period || '');
      }
    } else {
      formData.append('fk', String(vacancyId));
      formData.append('fio', data.fio);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('file', data.file);

      if (isPractice || isInternship) {
        formData.append('education_place', data.education_place || '');
        formData.append('practice_period', data.practice_period || '');
      }
    }

    try {
      if (isInternship) {
        await InfoApi.internshipResumeSubmission(formData);
      } else if (!vacancyId) {
        await InfoApi.resumeSubmission(formData);
      } else {
        await InfoApi.vacancyApplication(formData);
      }

      modals?.openModal({
        body: <PopUp text={t('successfullySent')} closeModal={() => modals?.resetData()} />,
      });

      onSuccess?.();

      setTimeout(() => {
        modals?.resetData();
        router.push('/vacancies');
      }, 3000);

    } catch (error) {
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFileFront = (file: File) => {
    setValue('file', file)
  }

  return (
    <>
      <div className={s.form}>
        <Container>
          <Heading title={t('forms.card.resume_title')} color="#1D246C" />
          <div>
            <form className={s.formGrid} onSubmit={handleSubmit(onSubmit)}>
              <div className={s.inputs}>
                <RscInput
                  error={errors.fio}
                  label={t('forms.card.fio')}
                  {...register('fio', {
                    required: t('forms.card.input') + t('forms.card.fio'),
                  })}
                  type="string"
                />
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: t('forms.card.input') + t('forms.card.phone'),
                    minLength: {
                      value: KG_PHONE_MAX_LENGTH,
                      message: t('forms.card.phone_error'),
                    },
                  }}
                  render={({ field: { value } }) => {
                    return (
                      <InputPhone
                        placeholder={t('forms.card.phone')}
                        label={t('forms.card.phone')}
                        error={errors.phone}
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
                <RscInput
                  label={t('contacts.email')}
                  placeholder={t('forms.contacts.email')}
                  {...register('email', {
                    required:
                      t('forms.card.input') + 'email',
                    pattern: {
                      value: EMAIL_SINX,
                      message: t('forms.card.email_error'),
                    },
                  })}
                  error={errors.email}
                />
                {!vacancyId && (
                  <Controller
                    control={control}
                    name="fk"
                    rules={{
                      required: t('job.students.direction'),
                    }}
                    render={({ field }) => (
                      <RskSelect
                        label={t('job.students.direction')}
                        optionsList={departments.map((dep) => ({
                          name: dep.name,
                          id: dep.id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('job.students.direction')}
                        error={errors.fk}
                      />
                    )}
                  />
                )}
                {isPractice && (
                  <>
                    <RscInput
                      label={t('job.students.practice_period')}
                      placeholder={t('job.students.practice_period')}
                      {...register('practice_period', {
                        required: t('forms.card.input') + ' ' + t('job.students.practice_period'),
                      })}
                      error={errors.practice_period}
                    />
                  </>
                )}
                {(isInternship || isPractice) && (
                  <RscInput
                    label={t('job.students.place_of_study')}
                    placeholder={t('job.students.place_of_study')}
                    {...register('education_place', {
                      required: t('forms.card.input') + ' ' + t('job.students.place_of_study'),
                    })}
                    error={errors.education_place}
                    disabled={isLoading}
                  />
                )}
                <div className={s.buttonWrapper}>
                  <Button
                    value={isLoading ? 'Отправка...' : t('forms.card.button_send')}
                    onClick={handleSubmit(onSubmit)}
                    isLarge
                    isLong
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className={s.inputLoader}>
                <Controller
                  control={control}
                  name="file"
                  render={() => (
                    <CkSelectDocument
                      {...register('file', {
                        required: t('forms.card.resume'),
                      })}
                      label={t('forms.card.download_file')}
                      fileTypes={['DOC', 'PDF', 'DOCX', 'JPG', 'JPEG', 'PNG']}
                      onChangeFiles={loadFileFront}
                      error={errors?.file}
                    />
                  )}
                />
              </div>
              <div className={s.buttonMobile}>
                <Button
                  color="linear-gradient(135deg, #0F8989, #156CE6) !important"
                  value={isLoading ? 'Отправка...' : t('forms.card.button_send')}
                  onClick={handleSubmit(onSubmit)}
                  isLarge
                  isLong
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  )
}

export default FormJob