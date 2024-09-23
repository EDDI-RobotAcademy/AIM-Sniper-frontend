import { ActionContext } from "vuex"
import { Survey, SurveyState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_SURVEY_LIST_TO_DJANGO, REQUEST_SURVEY_FORM_TO_DJANGO } from "./mutation-types"

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
    requestSurveyFormToDjango(context: ActionContext<SurveyState, any>, surveyId: number): Promise<void>
    requestSubmitSurveyToDjango(context: ActionContext<any, any>, payload: {submitForm: []}): Promise<AxiosResponse>
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
        const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.get('/survey/survey-title-list');
            const data: Survey[] = res.data.surveyTitleList;
            context.commit(REQUEST_SURVEY_LIST_TO_DJANGO, data);
    },
    async requestSurveyFormToDjango(context: ActionContext<SurveyState, any>, surveyId: number): Promise<void> {
        const res: AxiosResponse<Survey> = await axiosInst.djangoAxiosInst.get(`/survey/read-survey-form/${surveyId}`);
        context.commit(REQUEST_SURVEY_FORM_TO_DJANGO, res.data);
    },
    async requestSubmitSurveyToDjango(context: ActionContext<any, any>, payload: {submitForm: []}): Promise<AxiosResponse> {
        const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.post('/survey/submit-survey', payload);
        return res.data
    }

};

export default actions;