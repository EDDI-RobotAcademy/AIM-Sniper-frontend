import { ActionContext } from "vuex"
import { Survey, SurveyState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_SURVEY_LIST_TO_DJANGO } from "./mutation-types"

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
    requestSurveyListToDjango(context: ActionContext<SurveyState, any>): Promise<void>

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
    },
    async requestSurveyListToDjango(context: ActionContext<SurveyState, any>): Promise<void>{
        const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.get('/survey/survey-list');
            const data: Survey[] = res.data.surveyTitleList;
            console.log('data가 들어왔나요?:', data)
            context.commit(REQUEST_SURVEY_LIST_TO_DJANGO, data);
    }
};

export default actions;