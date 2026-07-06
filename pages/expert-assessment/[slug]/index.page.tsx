import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { SurveyQuestion } from 'services/api/ArchiveCurrencyApiModule'
import { format } from 'date-fns'

import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import s from './complaint.module.scss'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormValuesOrder } from 'pages/credits/order-credit/index.page'
import { Textarea } from 'components/ui/Textarea'
import { RscInput } from 'components/ui/Input'
import { InputPhone, KG_PHONE_MAX_LENGTH } from 'components/Input/InputPhone'
import Button from 'components/Buttons/Button'
import { ArchiveCurrencyApi } from 'services/api/ArchiveCurrencyApi'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useOutside from 'helpers/useOutside'
import Icon from 'components/Icon'
import clsx from 'clsx'
import { checkQueryParams } from 'helpers/changeTypeOfUse'
import logo from 'public/images/LogoName.png'
import AppImage from 'components/ui/AppImage'
import Error404 from 'components/Error505'

interface Props {
  data?: SurveyQuestion[]
  branchesGet?: any
}

interface IResponses {
  question: number
  rank: number
  comment: string
  selected_checkboxes: number[]
}
const booleanStar = (rating: number) => rating < 4 && rating > 0
const ExpertAssessmentSlug: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()
  const [response, setResponse] = useState<IResponses[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { ref, isShow, setIsShow } = useOutside(false)
  const router: any = useRouter()
  const [erorrs, setErrors] = useState<any>('')
  const Router = useRouter()
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValuesOrder>({
    mode: 'onChange',
    defaultValues: {
      for_who: 1,
    },
  })
  const fetchMyAPI = async () => {
    const { data } = await ArchiveCurrencyApi.getDetailBranches(
      router?.query?.slug
    )
    setErrors(data)
  }

  useEffect(() => {
    if (router.pathname?.includes('[slug]')) {
      fetchMyAPI()
    }
  }, [])
  useEffect(() => {
    if (data?.length) {
      setResponse(
        data.map((item) => {
          return {
            question: item.id,
            comment: '',
            rank: 0,
            selected_checkboxes: [],
          }
        })
      )
    }
  }, [data])

  const handleCheckboxChange = (questionId: number, idCheckbox: number) => {
    setResponse((prev) =>
      prev.map((item) => {
        if (item.question === questionId) {
          return {
            ...item,
            selected_checkboxes: item.selected_checkboxes.includes(idCheckbox)
              ? item.selected_checkboxes.filter((item) => item !== idCheckbox)
              : [...item.selected_checkboxes, idCheckbox],
          }
        }
        return {
          ...item,
        }
      })
    )
  }

  const onSubmit: SubmitHandler<FormValuesOrder> = async (data) => {
    setLoading(true)
    try {
      if (!erorrs?.id) {
        setLoading(false)
        setErrorMessage(t('error_branch_popup'))
        setShowError(true)
        return
      }
      const obj = {
        responses: response,
        full_name: data.full_name,
        phone_number: data.phone,
        suggestion: data.message,
        branch_id: erorrs?.id,
      }
      await ArchiveCurrencyApi.postCustomerQuestions(obj)
      setLoading(false)
      setShowSuccess(true)
    } catch (e) {
      setLoading(false)
      setErrorMessage(t('rating.text_erros_validate_rating'))
      setShowError(true)
    }
  }

  const changeLocale = (locale: string) => {
    router.push(
      {
        route: router.pathname,
        query: checkQueryParams(router.query),
      },
      router.asPath,
      { locale }
    )
  }

  if (erorrs === null) {
    return <Error404 />
  }
  return (
    <>
      <Head>
        <title>{t('rating.title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={t('rating.title')} key="og:title" />
        <meta
          property="og:description"
          content={t('rating.title')}
          key="og:description"
        />
        <meta
          name="description"
          content={t('rating.title')}
          key="description"
        />
        <meta name="keywords" content={t('rating.title')} key="keywords" />
      </Head>

      {showSuccess && (
        <div
          className={s.successOverlay}
          onClick={() => {
            setShowSuccess(false)
            Router.push('/')
          }}
        >
          <div className={s.successModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.successIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12L10 17L19 7"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={s.successTitle}>{t('successfullySent')}</p>
            <p className={s.successSubtitle}>{t('rating.title')}</p>
            <button
              className={s.successBtn}
              onClick={() => {
                setShowSuccess(false)
                Router.push('/')
              }}
            >
              {t('popup_accep')}
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className={s.errorOverlay} onClick={() => setShowError(false)}>
          <div className={s.errorModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.errorIcon}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12M12 16H12.01"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="white"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
            <p className={s.errorTitle}>{errorMessage}</p>
            <button className={s.errorBtn} onClick={() => setShowError(false)}>
              {t('popup_accep')}
            </button>
          </div>
        </div>
      )}

      <Section>
        <Container>
          <div
            style={{
              paddingTop: 10,
            }}
          >
            <div className={s.logo}>
              <AppImage alt={'logo'} src={logo} height={50} width={140} />
            </div>
            <div
              className={s.lang}
              onClick={() => setIsShow(!isShow)}
              ref={ref}
            >
              <div className={s.langItem}>
                {router.locale === 'ky' && (
                  <Icon
                    className={s.langIcon}
                    id="kyg"
                    width={24}
                    height={24}
                  />
                )}
                {router.locale === 'ru' && (
                  <Icon
                    className={s.langIcon}
                    id="russ"
                    width={24}
                    height={24}
                  />
                )}
                {router.locale === 'en' && (
                  <Icon
                    className={s.langIcon}
                    id="usal"
                    width={24}
                    height={24}
                  />
                )}
                {!isShow ? (
                  <Icon
                    className={s.langIconArrow}
                    width={12}
                    height={12}
                    id="arrow-down-thin"
                  />
                ) : (
                  <Icon
                    className={s.langIconArrow}
                    width={12}
                    height={12}
                    id="arrow-up-thin"
                  />
                )}
              </div>
              {isShow && (
                <div className={s.langDropdown}>
                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('ky')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="kyg"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}>Кыргызча</p>
                  </div>
                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('ru')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="russ"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}>Русский</p>
                  </div>

                  <div
                    className={clsx(s.langDropdownItem, 'light-14')}
                    onClick={() => changeLocale('en')}
                  >
                    <Icon
                      className={s.langIcon}
                      id="usal"
                      width={24}
                      height={24}
                    />
                    <p className={clsx(s.langTitle, 'light-14')}> English</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            {data?.map((item) => {
              const findResponse = response.find(
                (resItem) => resItem.question === item.id
              )
              return (
                <div key={item.id}>
                  <div className={s.ratingArea}>
                    <div>
                      <h4 className={s.title_star}>{item.title}</h4>
                      <div>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <React.Fragment key={star}>
                            <input
                              type="radio"
                              id={`star${item.id}-${star}`}
                              name={`rating${item.id}`}
                              value={star}
                              checked={findResponse?.rank === star}
                              onChange={() =>
                                setResponse((prev) =>
                                  prev.map((preItem) => {
                                    if (
                                      preItem.question ===
                                      findResponse?.question
                                    ) {
                                      return {
                                        ...preItem,
                                        rank: star,
                                        selected_checkboxes:
                                          star <= 3
                                            ? preItem.selected_checkboxes
                                            : [],
                                      }
                                    }
                                    return {
                                      ...preItem,
                                    }
                                  })
                                )
                              }
                            />
                            <label
                              htmlFor={`star${item.id}-${star}`}
                              title={`Оценка «${star}»`}
                            ></label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  {booleanStar(findResponse?.rank || 0) &&
                  item?.checkboxes.length ? (
                    <>
                      <div className={s.formContainer}>
                        <h4>{t('rating.title_show')}</h4>
                        {item.checkboxes.map((option) => (
                          <div
                            key={option.id}
                            className={`${s.option} ${
                              findResponse?.selected_checkboxes.includes(
                                option.id
                              )
                                ? s.selected
                                : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={String(option.id)}
                              checked={findResponse?.selected_checkboxes.includes(
                                option.id
                              )}
                              onChange={() =>
                                handleCheckboxChange(item.id, option.id)
                              }
                            />
                            <label htmlFor={String(option.id)}>
                              {option.text}
                            </label>
                          </div>
                        ))}
                      </div>
                      <p className={s.subtitle}>
                        {t('rating.question_comment')}
                      </p>
                      <form
                        onChange={(e: any) =>
                          setResponse((prev) =>
                            prev.map((prevCheck) => {
                              if (prevCheck.question === item.id) {
                                return {
                                  ...prevCheck,
                                  comment: e.target.value,
                                }
                              }
                              return {
                                ...prevCheck,
                              }
                            })
                          )
                        }
                      >
                        <Textarea
                          label=""
                          // placeholder={t('rating.question_comment')}
                          value={findResponse?.comment}
                        />
                      </form>
                    </>
                  ) : null}
                </div>
              )
            })}
            <form onSubmit={handleSubmit(onSubmit)}>
              <>
                <RscInput
                  label={t('forms.card.fio')}
                  error={errors.full_name}
                  {...register('full_name', {
                    required: t('forms.card.fio'),
                  })}
                />
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: t('forms.credit.phone'),
                    minLength: {
                      value: KG_PHONE_MAX_LENGTH,
                      message: t('forms.credit.phone_error'),
                    },
                  }}
                  render={({ field: { value } }) => {
                    return (
                      <InputPhone
                        placeholder={t('forms.credit.phone')}
                        label={t('forms.credit.phone')}
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
                <Textarea
                  label={t('feedback.your_message')}
                  // error={errors.message}
                  // {...register('message', {
                  //   required: 'Оставьте свое сообщение',
                  // })}
                />
                <Button
                  value={t('feedback.send')}
                  className={s.btn_send}
                  onClick={handleSubmit(onSubmit)}
                  isLarge
                  isLoading={loading}
                  isLong
                />
              </>
            </form>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ExpertAssessmentSlug

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params: _params,
  locale,
}) => {
  const type: any = query
  const lang: any = locale
  const date2 = (type.date || format(new Date(), 'yyyy-MM-dd')) as string
  const chech: any =
    type?.date?.length !== 0 ? { date: date2 } : { date: type.date }
  const { data } = await ArchiveCurrencyApi.getCustomerQuestions(lang)

  return {
    props: {
      data: data || [],
      chech,
      ...(await getTranslations(lang)),
    },
  }
}
