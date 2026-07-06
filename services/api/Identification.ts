import { FormAddress } from 'pages/online-service/order-identification/DeteilOrder'
import { RequestOrderProps } from 'pages/online-service/order-identification/RequestOrder'
import { clientApi, serverApi } from './apiService'
import { OnlineIndetification } from 'pages/online-service/check-indentification/index.page'
import { FormRequestOrderProps, IGenerateSchedule } from 'pages/online-service/savings-mortgage/RequestOrder'

export const IdentificationApi = {
    getIdentification(local: string) {
        return serverApi.get('/identification_info', {
            headers: {
                'Accept-Language': local,
            },
        })
    },
    IdentificationReuest(data: RequestOrderProps) {
        return clientApi.post('/identification_1', data)
    },
    IdentificationAdress(id: number, data: FormAddress) {
        return clientApi.put(`/identification_2/${id}`, data)
    },
    IdentificationDeteilUser(id: number, data: FormData) {
        return clientApi.put(`/identification_3/${id}`, data)
    },
    IdentificationOtp(id: number, code: string) {
        return clientApi.post(`/identification_code/${id}/check_code`, {
            code,
        })
    },
    IdentificationOtpReset(id: number) {
        return clientApi.post(`/identification_code/${id}/resend_code`, null)
    },
    IdentificationCheckStatus(data: OnlineIndetification) {
        return clientApi.post(`/identification/check-status`, data)
    },

    ////
    IdentificationDeteilUserMortgage1(value: FormRequestOrderProps) {
        return clientApi.post(`/mortgage_identification_1`, value)
    },
    IdentificationAdress2(id: number, data: FormAddress) {
        return clientApi.put(`/mortgage_identification_2/${id}`, data)
    },
    IdentificationDeteilUserMortgage(id: number, data: FormData) {
        return clientApi.put(`/identification_mortgage/${id}`, data)
    },
    ////
    GenerateSchedulePost(data: IGenerateSchedule) {
        return clientApi.post("/mortgage_schedule/generate_schedule", data)
    },
    IdentificationAdressMortgage3(id: number, data: FormData) {
        return clientApi.put(`/mortgage_identification_3/${id}`, data)
    },

    IdentificationOtpMoratange(id: number, code: string) {
        return clientApi.post(`/mortgage_identification_code/${id}/check-code`, {
            code,
        })
    },
    IdentificationOtpResetMoratange(id: number) {
        return clientApi.post(`/mortgage_identification_code/${id}/resend_code`, null)
    },
    IdentificationOtpMoratangeEmail(value: {application_id: number, verification_code: number | string}) {
        return clientApi.post(`/verification/verify-code`, value)
    },
    IdentificationOtpResetMoratangeEmail(value: {application_id: number}) {
        return clientApi.post(`/verification/send-code`, value)
    },
    getIdentificationMortgageDocs(local: string) {
        return serverApi.get('/mortgage_identification_docs', {
            headers: {
                'Accept-Language': local,
            },
        })
    },
}
