import { ActionContext } from "vuex"
// import { SurveyState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
export type SurveyActions = {
    requestCreateSurveyFormToDjango(context: ActionContext<any, any>): Promise<AxiosResponse>
    requestRegisterTitleAndDescriptionToDjango(
        context: ActionContext<any, any>,
        payload: {surveyId: number, surveyTitle:string, surveyDescription: string}): Promise<AxiosResponse>
    requestCreateQuestionToDjango(
        context: ActionContext<any, any>,
        payload: {surveyId: number, questionTitle: string, questionType: string, isEssential: boolean}): Promise<AxiosResponse>
    requestRegisterSelectionToDjango(context: ActionContext<any, any>,
        payload: {questionId: number, selection: string}): Promise<AxiosResponse>

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
    async requestCreateQuestionToDjango(
        context: ActionContext<any, any>,
        payload: {surveyId: number, questionTitle: string, questionType: string, isEssential: boolean}): Promise<AxiosResponse> {
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/register-question', payload)
        return res.data
        },
    async requestRegisterSelectionToDjango(context: ActionContext<any, any>,
        payload: {questionId: number, selection: string}): Promise<AxiosResponse> {
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/register-selection', payload)
        return res.data           
        }
};

export default actions;