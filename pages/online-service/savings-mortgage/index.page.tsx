import { GetServerSideProps, NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { IdentificationApi } from 'services/api/Identification'
import { IdentificationProps } from 'models/identification'
import Container from 'components/Container'
import RequestOrder, { FormRequestOrderProps } from './RequestOrder'
import { FormAddress } from './DeteilOrder'
import DeteilUser, { FormDeteilUser } from './DeteilUser'
import AddressForm from './DeteilOrder'
import PopUp from 'components/PopUp'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import PopUpInput from 'components/PopUpInput'
import Loader from 'components/Loader'
import { store } from 'store'
import { toast } from 'react-toastify'
import Modal from 'components/ui/Modal'
import { EMAIL_SINX } from '../../../helpers/email-sinx'
import { RscInput } from 'components/ui/Input'
import { FieldError, useForm } from 'react-hook-form'
import Button from 'components/Buttons/Button'
export function getValue(obj:any) {
  const keys = Object.keys(obj);
  
  if (keys.length > 0) {
      return obj[keys[0]];
  }
  

  return null;
}
export function removeSpaces(str:string) {
  return str.replace(/\s/g, '');
}
export const errorsResponse = (status: number, response: any) => {

  if(status >= 500) {
    return "Ошибка на сервере"
  }

  if(status === 404) {
    return "Такой страницы не существует"
  }

  return getValue(response)
}

export interface IFileMortgage {
  id: number,
  title: string,
  file: string,
}
interface Props {
  info: IdentificationProps
  docs_mortgage: IFileMortgage[]
}

enum IdentificationRequestSteps {
  Info,
  Address,
  UserDeteil,
}
const IdentificationRequest: NextPage<Props> = ({ info, docs_mortgage }) => {
  const _modals = store
  const _router = useRouter()
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const [popUp, setPopUp] = useState<{
    text: string
    state: boolean
    unic_key: string
    otp: boolean
    otp_error: string
    email: boolean
  }>({
    text: '',
    state: false,
    unic_key: '',
    otp: false,
    otp_error: '',
    email: false,
  })
  const {
    register,
    handleSubmit,
    setError: _setError,
    formState: { errors },
    setValue: setFormValue,
    watch,
    control: _control
  } = useForm<any>({
    mode: 'onChange',
  });
  const [currentStep, setCurrentStep] = useState(
    IdentificationRequestSteps.Info
  )
  const _emailValue = watch('email');
  const _phoneValue = watch('phone');

  const [applicationId, setApplicationId] = useState<number>(0)
  const [otp, setOtp] = useState<string>('')
  const [value, setValue] = useState<any>(null)
  const goToNext = () => {
    setCurrentStep((prev) => prev + 1)
  }
  const goBack = () => {
    setCurrentStep((prev) => prev - 1)
  }
  const formatDayMonth = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd')
  }
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (popUp.email) {
      setFormValue('email', value?.email || '');
      setFormValue('phone', value?.phone || '');
    }
  }, [popUp.email, value?.email, setFormValue, value?.phone]);
  // * Первый шаг:
  const onSubmitRequestOrder = async (info: FormRequestOrderProps) => {
    setValue((prev:any) => {
      return {
        ...prev,
        ...info
      }
    })
    setLoader(true)
    // const token = await getReCaptchaKey();
    // if (!token) {
    //   setLoader(false)
    //   modals.openModal({
    //     body: (
    //       <PopUp
    //         text="Ошибка рекапчи"
    //         closeModal={() => modals?.resetData()}
    //       />
    //     ),
    //   })
    //   return null
    // }
  
    try {
      const { data } = await IdentificationApi.IdentificationDeteilUserMortgage1({
        ...info,
        first_deposit_amount: removeSpaces(info?.first_deposit_amount),
        housing_estimated_value: removeSpaces(info?.housing_estimated_value),
      })
      setApplicationId(data.id)
      goToNext()
      setLoader(false)
    } catch (error:any) {
      setLoader(false)
      toast.warning(
        errorsResponse(error?.response?.status, error?.response?.data?.length ? getValue(error?.response?.data)[0] : "Ошибка на сервере")
      )
    } finally {
      setLoader(false)
    }
  }
  // * Второй шаг:
  const onSubmitAddress = async (data: FormAddress) => {
    setValue((prev:any) => {
      return {
        ...prev,
        ...data
      }
    })
    setLoader(true)
    try {
      await IdentificationApi.IdentificationAdress2(applicationId, {
        ...value,
        ...data
      })
      goToNext()
      setLoader(false)
    } catch (error:any) {
      setLoader(false)
      toast.warning(
        errorsResponse(error?.response?.status, error?.response?.data?.length ? getValue(error?.response?.data)[0] : "Ошибка на сервере")
      )
    } finally {
      setLoader(false)
    }
  }
  //* Третий шаг:
  const onSubmitDetails = async (data: FormDeteilUser) => {
    setValue((prev:any) => {
      return {
        ...prev,
        ...data
      }
    })

    setPopUp({
      ...popUp,
      email: true
    })
  }

  const onSubmitOtp = async () => {
    setLoader(true)
    try {
      if((value?.phone?.slice(0,5)?.includes("996"))) {
        await IdentificationApi.IdentificationOtpMoratange(applicationId, otp).then(
          (res) => {
            setLoader(false)
            setPopUp({
              text: res.data.message,
              state: true,
              unic_key: res.data.num,
              otp: false,
              otp_error: '',
              email: false,
            })
          }
        )
      } else {
        await IdentificationApi.IdentificationOtpMoratangeEmail({
          application_id: applicationId,
          verification_code: otp
        }).then(
          (res) => {
            setLoader(false)
            setPopUp({
              text: res.data.message,
              state: true,
              unic_key: res.data.num,
              otp: false,
              otp_error: '',
              email: false,
            })
          }
        )
      }

    } catch (error: any) {
      setPopUp({
        ...popUp,
        otp_error: error.response.data.code || "Неверный код подтверждения",
      })
    } finally {
      setLoader(false)
    }
  }
  const handleClosePopUp = async () => {
    setPopUp({
      ...popUp,
      email: false
    })
  }
  const resetOtpCode = async () => {
    if((value?.phone?.slice(0,5)?.includes("996"))) {
      try {
        await IdentificationApi.IdentificationOtpResetMoratange(applicationId).then(
          (_res) => { }
        )
      } catch (error: any) {
        setPopUp({
          ...popUp,
          otp_error: error?.response?.data?.detail,
        })
      }
    } else {
      try {
        await IdentificationApi.IdentificationOtpResetMoratangeEmail({application_id: applicationId}).then(
          (_res) => { }
        )
      } catch (error: any) {
        setPopUp({
          ...popUp,
          otp_error: error?.response?.data?.detail,
        })
      }

    }
  }

  const nextStep = async (formData?: any) => {
    const currentData = {
      ...value,
      ...formData,
      received_date: formatDayMonth(value.received_date || value?.received_date),
      end_date: formatDayMonth(value.end_date || value?.end_date),
    };

    const formDataToSend = new FormData();
    Object.keys(currentData).forEach((key) => {
      formDataToSend.append(key, currentData[key]);
    });

    setLoader(true);
    try {
      await IdentificationApi.IdentificationAdressMortgage3(
        applicationId,
        formDataToSend
      ).then((_res) => {
        setLoader(false);
        setPopUp({
          ...popUp,
          otp: true,
          email: false
        });
      });
    } catch (error: any) {
      toast.warning(
        errorsResponse(error?.response?.status, error?.response?.data?.length ? getValue(error?.response?.data)[0] : "Ошибка на сервере")
      );
    } finally {
      setLoader(false);
    }
  };

  const STEPS = [
    t('savingsMortgage.personal'),
    t('savingsMortgage.residential_address'),
    t('savingsMortgage.passport_details'),
  ]

  const MESSAGE_INFO = info?.page.application_caption
  const personalData = info?.page?.personal_data_processing

  const renderSteps = () => {
    switch (currentStep) {
      case IdentificationRequestSteps.Info: {
        return (
          <RequestOrder
            goBack={goBack}
            value={value}
            message={MESSAGE_INFO}
            current={currentStep + 1}
            onSubmitHandler={onSubmitRequestOrder}
            steps={STEPS}
            setValueState={setValue}
          />
        )
      }

      case IdentificationRequestSteps.Address: {
        return (
          <AddressForm
            goBack={goBack}
            message={MESSAGE_INFO}
            steps={STEPS}
            current={currentStep + 1}
            formInfo={info}
            value={value}
            setValueState={setValue}
            onSubmitHandler={onSubmitAddress}
          />
        )
      }
      case IdentificationRequestSteps.UserDeteil: {
        return (
          <DeteilUser
            personalData={personalData}
            goBack={goBack}
            docs_mortgage={docs_mortgage}
            message={MESSAGE_INFO}
            steps={STEPS}
            current={currentStep + 1}
            setValueState={setValue}
            formInfo={info}
            value={value}
            onSubmitHandler={onSubmitDetails}
          />
        )
      }
    }
  }

  return (
    <>
      {loader && <Loader />}
      <Container>
        {popUp.state && (
          <PopUp href="/" text={popUp?.text ? `<div> 
    <p style="font-size: 24px; text-align: center; margin-bottom: 20px; font-weight: 600; color: #2c3e50;"> 
        ${popUp?.text} 
    </p> 
    <div style="font-size: 18px; line-height: 1.6; color: #34495e; margin-bottom: 15px;"> 
        ${t("notification.title")} 
        <br> 
        ${t("notification.step")} 
        <a href="https://zoom.us/download" style="color: #2980b9; text-decoration: none; font-weight: bold;" target="_blank">Zoom</a>  
        ${t("notification.mobile_text")} 
    </div> 
     
    <div style="font-size: 18px; line-height: 1.6; color: #34495e; margin-bottom: 20px;"> 
        ${t("notification.step_2")} 
        <a href="https://api.whatsapp.com/send?phone=996706911111" style="color: #2980b9; text-decoration: none; font-weight: bold;" target="_blank">WhatsApp-канал</a> 
        ${t("notification.mobile_text_step_2")} 
    </div> 
</div>` : "Ошибка на сервере"} unicKey={popUp.unic_key} />
        )}
        {popUp.otp && (
          <PopUpInput
            isEmail={!(value?.phone?.slice(0,5)?.includes("996"))}
            resetOtpCode={resetOtpCode}
            onSumbit={onSubmitOtp}
            value={otp}
            onChange={setOtp}
            error={popUp.otp_error}
          />
        )}

        {popUp.email && (
          <Modal isOpen={popUp.email} onClose={handleClosePopUp} width={'500px'}>
            <div style={{
              padding: '32px',
              textAlign: 'center',
              borderRadius: '12px',
              background: 'white',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h3 style={{
                marginBottom: '16px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                {value?.phone?.slice(0,5)?.includes("996")
                  ? t('phoneVerification.check_phone') || 'Проверьте ваш номер телефона'
                  : t('emailVerification.check_email') || 'Проверьте ваш email'}
              </h3>

              <form style={{ marginBottom: '24px' }}>
                {value?.phone?.slice(0,5)?.includes("996") ? (
                  <div style={{ marginBottom: '20px' }}>
                    <RscInput
                      label={t('phoneVerification.phone_number') || 'Номер телефона:'}
                      error={errors.phone as FieldError}
                      {...register('phone', {
                        required: t('phoneVerification.phone_error') || 'Обязательное поле',
                        pattern: {
                          value: /^996\d+$/,
                          message: t('phoneVerification.phone_format_error') || 'Номер должен начинаться с 996'
                        },
                        validate: {
                          noSpaces: value =>
                            !value?.includes(' ') || (t('phoneVerification.phone_spaces_error') || 'Не используйте пробелы'),
                          minLength: value =>
                            value?.length >= 12 || (t('phoneVerification.phone_length_error') || 'Номер слишком короткий')
                        }
                      })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #dfe6e9',
                        backgroundColor: '#f5f6fa',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '20px' }}>
                    <RscInput
                      label={t('contacts.email')}
                      placeholder="example@mail.com"
                      {...register('email', {
                        required: t('forms.card.email_error') || 'Обязательное поле',
                        pattern: {
                          value: EMAIL_SINX,
                          message: t('forms.card.email_error') || 'Некорректный email'
                        },
                        validate: {
                          noSpaces: value =>
                            !value?.includes(' ') || (t('forms.card.email_error') || 'Не используйте пробелы')
                        }
                      })}
                      error={errors.email as FieldError}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #dfe6e9'
                      }}
                    />
                  </div>
                )}

                <Button
                  value={
                    value?.phone?.slice(0,5)?.includes("996")
                      ? t('phoneVerification.confirm') || 'Подтвердить номер'
                      : t('emailVerification.confirm') || 'Подтвердить email'
                  }
                  disabled={!value?.phone?.slice(0,5)?.includes("996") && !!errors.email}
                  onClick={handleSubmit(nextStep)}
                />
              </form>
            </div>
          </Modal>
        )}

        {renderSteps()}
      </Container>
    </>
  )
}

export default IdentificationRequest
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await IdentificationApi.getIdentification(locale || 'ru')
  const docsMortgage = await IdentificationApi.getIdentificationMortgageDocs(locale || 'ru')
  return {
    props: {
      info: data,
      docs_mortgage: docsMortgage?.data,
      ...(await getTranslations(locale as string)),
    },
  }
}
