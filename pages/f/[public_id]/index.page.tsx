import Container from 'components/Container'
import Section from 'components/Section'
import { GetServerSideProps, NextPage } from 'next'
import { getTranslations } from 'helpers/serverTranslations'
import { SurveyQuestion } from 'services/api/ArchiveCurrencyApiModule'

import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import s from '../../expert-assessment/[slug]/complaint.module.scss'
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
import Image from 'next/image'
import Error404 from 'components/Error505'
import FeedbackResultModal from 'pages/f/[public_id]/components/Feedbackresultmodal'

interface Props {
  data?: SurveyQuestion[]
}

interface IResponses {
  question: number
  rank: number
  comment: string
  selected_checkboxes: number[]
}

interface IResultModal {
  text: string
  redirectOnClose?: boolean
}

const booleanStar = (rating: number) => rating < 4 && rating > 0

const FeedbackByPublicId: NextPage<Props> = ({ data }) => {
  const { t } = useTranslation()
  const [response, setResponse] = useState<IResponses[]>([])
  const [loading, setLoading] = useState(false)
  const { ref, isShow, setIsShow } = useOutside(false)
  const router: any = useRouter()
  const [branch, setBranch] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const [inactive, setInactive] = useState(false)
  const [resultModal, setResultModal] = useState<IResultModal | null>(null)
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

  const fetchBranch = async () => {
    const { data } = await ArchiveCurrencyApi.getDetailBranchesByPublicId(
      router?.query?.public_id
    )
    if (data === null) {
      setNotFound(true)
    } else if (data.is_active === false) {
      setBranch(data)
      setInactive(true)
    } else {
      setBranch(data)
    }
  }

  useEffect(() => {
    if (router.query?.public_id) {
      fetchBranch()
    }
  }, [router.query?.public_id])

  useEffect(() => {
    if (data?.length) {
      setResponse(
        data.map((item) => ({
          question: item.id,
          comment: '',
          rank: 0,
          selected_checkboxes: [],
        }))
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
              ? item.selected_checkboxes.filter((id) => id !== idCheckbox)
              : [...item.selected_checkboxes, idCheckbox],
          }
        }
        return item
      })
    )
  }

  const closeResultModal = () => {
    const shouldRedirect = resultModal?.redirectOnClose
    setResultModal(null)
    if (shouldRedirect) {
      Router.push('/')
    }
  }

  const onSubmit: SubmitHandler<FormValuesOrder> = async (formData) => {
    if (response.some((item) => !item.rank)) {
      setResultModal({ text: t('rating.text_erros_validate_rating') })
      return
    }
    setLoading(true)
    try {
      if (!branch?.id) {
        setResultModal({ text: t('error_branch_popup') })
        setLoading(false)
        return
      }
      const obj = {
        responses: response,
        full_name: formData.full_name,
        phone_number: formData.phone,
        suggestion: formData.message,
        branch_id: branch.id,
        ...(router.query?.point && { point: String(router.query.point) }),
      }
      await ArchiveCurrencyApi.postCustomerQuestions(obj)
      setLoading(false)
      setResultModal({ text: t('successfullySent'), redirectOnClose: true })
    } catch (e) {
      setLoading(false)
      setResultModal({ text: t('rating.text_erros_validate_rating') })
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

  if (notFound) {
    return <Error404 />
  }

  if (inactive) {
    return (
      <Section>
        <Container>
          <div
            style={{ paddingTop: 40, paddingBottom: 40, textAlign: 'center' }}
          >
            <Image
              alt="logo"
              loader={(e) => e?.src}
              src={logo}
              height={50}
              width={140}
            />
            <p style={{ marginTop: 32, fontSize: 18, fontWeight: 600 }}>
              {t('rating.branch_inactive_title')}
            </p>
            {branch?.name && (
              <p style={{ marginTop: 8, fontSize: 15 }}>{branch.name}</p>
            )}
            {branch?.address && (
              <p style={{ fontSize: 14, color: '#666' }}>{branch.address}</p>
            )}
            <p style={{ marginTop: 16, fontSize: 14, color: '#999' }}>
              {t('rating.branch_inactive_subtitle')}
            </p>
          </div>
        </Container>
      </Section>
    )
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

      <Section>
        <Container>
          {branch?.is_closed && (
            <div
              style={{
                background: '#fff8e1',
                border: '1px solid #ffe082',
                borderRadius: 8,
                padding: '10px 16px',
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {branch.is_closed_till
                ? t('rating.branch_closed_till', {
                    date: new Date(branch.is_closed_till).toLocaleDateString(
                      router.locale
                    ),
                  })
                : t('rating.branch_closed_temp')}
            </div>
          )}
          <div style={{ paddingTop: 10 }}>
            <div className={s.logo}>
              <Image
                alt={'logo'}
                loader={(e) => e?.src}
                src={logo}
                height={50}
                width={140}
              />
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
                    <p className={clsx(s.langTitle, 'light-14')}>English</p>
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
                                    return preItem
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
                                return { ...prevCheck, comment: e.target.value }
                              }
                              return prevCheck
                            })
                          )
                        }
                      >
                        <Textarea label="" value={findResponse?.comment} />
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
                  render={({ field: { value } }) => (
                    <InputPhone
                      placeholder={t('forms.credit.phone')}
                      label={t('forms.credit.phone')}
                      error={errors.phone}
                      value={value}
                      onChangePhone={(event) => {
                        setValue('phone', event.formattedPhone)
                        setError('phone', { message: '' })
                      }}
                    />
                  )}
                />
                <Textarea
                  label={t('feedback.your_message')}
                  {...register('message')}
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

      <FeedbackResultModal
        isOpen={!!resultModal}
        onClose={closeResultModal}
        text={resultModal?.text}
      />
    </>
  )
}

export default FeedbackByPublicId

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lang: any = locale
  const { data } = await ArchiveCurrencyApi.getCustomerQuestions(lang)

  return {
    props: {
      data: data || [],
      ...(await getTranslations(lang)),
    },
  }
}
