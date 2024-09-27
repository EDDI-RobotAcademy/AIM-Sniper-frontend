import { ActionContext } from "vuex"
import { CompanyReport, CompanyReportState } from "./states"
import { AxiosResponse} from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_COMPANYREPORT_LIST_TO_DJANGO, REQUEST_COMPANYREPORT_TO_DJANGO } from "./mutation-types"

export type CompanyReportActions = {
    requestCompanyReportToDjango(
        context: ActionContext<CompanyReportState, any>, 
        companyReportId: number
    ): Promise<void>
    requestCompanyReportListToDjango(
        context: ActionContext<CompanyReportState, any>
    ): Promise<void>
    requestCreateCompanyReportToDjango(
        context: ActionContext<CompanyReportState, unknown>, 
        imageFormData: FormData
    ): Promise<AxiosResponse>
    requestDeleteCompanyReportToDjango(context: ActionContext<CompanyReportState, unknown>, companyReportId: number): Promise<void>
}

const actions: CompanyReportActions = {
    async requestCompanyReportToDjango(
        context: ActionContext<CompanyReportState, any>, 
        companyReportId: number
    ): Promise<void> {

        try {
            const res: AxiosResponse<CompanyReport> = 
                await axiosInst.djangoAxiosInst.get(`/company_report/read/${companyReportId}`)

            context.commit(REQUEST_COMPANYREPORT_TO_DJANGO, res.data)
        } catch (error) {
            console.error('requestCompanyReportToDjango() -> error:', error)
            throw error
        }
    },
    async requestCompanyReportListToDjango(context: ActionContext<CompanyReportState, any>): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.get('/company_report/list/');
            const data: CompanyReport[] = res.data;
            // console.log('data:', data)
            context.commit('REQUEST_COMPANYREPORT_LIST_TO_DJANGO', data);
        } catch (error) {
            console.error('Error fetching companyReport list:', error);
            throw error
        }
    },
    async requestCreateCompanyReportToDjango(context: ActionContext<CompanyReportState, unknown>, imageFormData: FormData): Promise<AxiosResponse> {
        try {
                // console.log('requestCreateCompanyReportToDjango()')
                const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/company_report/register', imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                // console.log('응답 데이터 : ', res.data)
                alert('보고서을 성공적으로 등록하셨습니다.');
                return res
            } catch (error) {
                console.log('requestCreateCompanyReportToDjango(): ', error)
                throw error
            }
    },
    async requestDeleteCompanyReportToDjango(context: ActionContext<CompanyReportState, unknown>, companyReportId: number): Promise<void> {
        try {
            // console.log('requestDeleteCompanyReportToDjango()')
            await axiosInst.djangoAxiosInst.delete(`/company_report/delete/${companyReportId}`)
        } catch (error) {
            console.log('requestDeleteBoardToDjango() 과정에서 문제 발생')
            throw error
        }
    },
};

export default actions;