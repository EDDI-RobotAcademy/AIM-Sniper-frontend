import { ActionContext } from "vuex"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type AIInterviewActions = {
    requestGetQuestionListToDjango(context: ActionContext<any, any>, sessionId: number): Promise<AxiosResponse>
}

const actions: AIInterviewActions = {
    async requestGetQuestionListToDjango(context: ActionContext<any, any>, sessionId: number): Promise<AxiosResponse> {
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/interview/get-session', sessionId)
        return res.data
    },
}

export default actions;