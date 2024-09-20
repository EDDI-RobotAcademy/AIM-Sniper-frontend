import { ActionContext } from "vuex"
// import { SurveyState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
export type SurveyActions = {
    requestCreateSurveyFormToDjango(context: ActionContext<any, any>): Promise<AxiosResponse>
    requestRegisterTitleAndDescriptionToDjango(
        context: ActionContext<any, any>,
        payload: {surveyId: number, surveyTitle:string, surveyDescription: string}): Promise<AxiosResponse>
}

const actions: SurveyActions = {
    async requestCreateSurveyFormToDjango(context: ActionContext<any, any>): Promise<AxiosResponse> {
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/creat-form')
        return res.data
    },
    async requestRegisterTitleAndDescriptionToDjango(
        context: ActionContext<any, any>,
        payload: {surveyId: number, surveyTitle:string, surveyDescription: string}): Promise<AxiosResponse>{
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/register-title-description', payload)
        return res.data

    },
};

export default actions;