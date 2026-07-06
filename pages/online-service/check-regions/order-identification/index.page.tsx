import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { IdentificationApi } from 'services/api/Identification'
import { IdentificationProps } from 'models/identification'
import Container from 'components/Container'
import RequestOrder, { RequestOrderProps } from './RequestOrder'
import { FormAddress } from './DeteilOrder'
import DeteilUser, { FormDeteilUser } from './DeteilUser'
import AddressForm from './DeteilOrder'
import PopUp from 'components/PopUp'
import { getTranslations } from 'helpers/serverTranslations'
import { useTranslation } from 'next-i18next'
import PopUpInput from 'components/PopUpInput'
import Loader from 'components/Loader'
import { store } from 'store'
import { getReCaptchaKey } from 'helpers/getReCapthaKey'

interface Props {
  info: IdentificationProps
}

enum IdentificationRequestSteps {
  Info,
  Address,
  UserDeteil,
}
const IdentificationRequest: NextPage<Props> = ({ info }) => {
  const { modals } = store
  const _router = useRouter()
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const [popUp, setPopUp] = useState<{
    text: string
    state: boolean
    unic_key: string
    otp: boolean
    otp_error: string
  }>({
    text: '',
    state: false,
    unic_key: '',
    otp: false,
    otp_error: '',
  })
  const [currentStep, setCurrentStep] = useState(
    IdentificationRequestSteps.Info
  )
  const [applicationId, setApplicationId] = useState<number>(0)
  const [otp, setOtp] = useState<string>('')

  const goToNext = () => {
    // Router.push(`${Router.pathname}/?filled=${currentStep + 1}`, "", {
    //   shallow: true,
    // });
    setCurrentStep((prev) => prev + 1)
  }
  const goBack = () => {
    setCurrentStep((prev) => prev - 1)
  }
  const formatDayMonth = (date: Date) => {
    return format(new Date(date), 'yyyy-MM-dd')
  }
  // * Первый шаг:
  const onSubmitRequestOrder = async (info: RequestOrderProps) => {
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
      ...info,
      recaptcha: token,
    }
    try {
      const { data } = await IdentificationApi.IdentificationReuest(currentData)
      setApplicationId(data.id)
      goToNext()
      setLoader(false)
    } catch (error) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setLoader(false)
    }
  }
  // * Второй шаг:
  const onSubmitAddress = async (data: FormAddress) => {
    setLoader(true)
    try {
      await IdentificationApi.IdentificationAdress(applicationId, data)
      goToNext()
      setLoader(false)
    } catch (error) {
      setLoader(false)
      modals.openModal({
        body: (
          <PopUp
            text={t('error_popup')}
            closeModal={() => modals?.resetData()}
          />
        ),
      })
    } finally {
      setLoader(false)
    }
  }
  //* Третий шаг:
  const onSubmitDetails = async (data: FormDeteilUser) => {
    const currentData: any = {
      ...data,
      received_date: formatDayMonth(data.received_date),
      end_date: formatDayMonth(data.end_date),
    }

    const formData = new FormData()

    Object.keys(currentData).forEach((key) => {
      formData.append(key, currentData[key])
    })
    setLoader(true)
    try {
      await IdentificationApi.IdentificationDeteilUser(
        applicationId,
        formData
      ).then((_res) => {
        setLoader(false)
        setPopUp({
          ...popUp,
          otp: true,
        })
      })
    } catch (error: any) {
      setPopUp({
        text: error?.response?.data?.detail,
        state: true,
        unic_key: '',
        otp: false,
        otp_error: '',
      })
    } finally {
      setLoader(false)
    }
  }

  const onSubmitOtp = async () => {
    setLoader(true)
    try {
      await IdentificationApi.IdentificationOtp(applicationId, otp).then(
        (res) => {
          setLoader(false)
          setPopUp({
            text: res.data.message,
            state: true,
            unic_key: res.data.num,
            otp: false,
            otp_error: '',
          })
        }
      )
    } catch (error: any) {
      setPopUp({
        ...popUp,
        otp_error: error.response.data.code,
      })
    } finally {
      setLoader(false)
    }
  }
  const resetOtpCode = async () => {
    try {
      await IdentificationApi.IdentificationOtpReset(applicationId).then(
        (_res) => { }
      )
    } catch (error: any) {
      setPopUp({
        ...popUp,
        otp_error: error?.response?.data?.detail,
      })
    }
  }

  const STEPS = [
    t('forms.credit.personal_data'),
    t('forms.identification.adress_contact'),
    t('forms.identification.passport_card'),
  ]
  const MESSAGE_INFO = info?.page.application_caption
  const _SUPORT_PHONE = info?.page.support_phone
  const personalData = info?.page?.personal_data_processing



  const renderSteps = () => {
    switch (currentStep) {
      case IdentificationRequestSteps.Info: {
        return (
          <RequestOrder
            goBack={goBack}
            message={MESSAGE_INFO}
            current={currentStep + 1}
            onSubmitHandler={onSubmitRequestOrder}
            steps={STEPS}
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
            onSubmitHandler={onSubmitAddress}
          />
        )
      }
      case IdentificationRequestSteps.UserDeteil: {
        return (
          <DeteilUser
            personalData={personalData}
            goBack={goBack}
            message={MESSAGE_INFO}
            steps={STEPS}
            current={currentStep + 1}
            formInfo={info}
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
          <PopUp href="/" text={popUp.text} unicKey={popUp.unic_key} />
        )}
        {popUp.otp && (
          <PopUpInput
            resetOtpCode={resetOtpCode}
            onSumbit={onSubmitOtp}
            value={otp}
            onChange={setOtp}
            error={popUp.otp_error}
          />
        )}
        {renderSteps()}
      </Container>
    </>
  )
}

export default IdentificationRequest
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data } = await IdentificationApi.getIdentification(locale || 'ru')
  return {
    props: {
      info: data,
      ...(await getTranslations(locale as string)),
    },
  }
}
