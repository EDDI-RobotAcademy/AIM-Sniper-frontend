import { ActionContext } from "vuex"
// import { SurveyState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type SurveyActions = {
    requestCreateSurveyFormToDjango(context: ActionContext<any, any>, payload: {title: string, questions: string }): Promise<AxiosResponse>
}

const actions: SurveyActions = {
    async requestCreateSurveyFormToDjango(context: ActionContext<any, any>, payload: {title: string, questions: string }): Promise<AxiosResponse>{
        console.log('django에 생성한 surveyForm 보내기')
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/survey/register', payload )
        return res.data
    }
};

export default actions;