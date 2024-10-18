import { ActionContext } from "vuex"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type AIInterviewActions = {
    requestGetQuestionListToDjango(context: ActionContext<any, any>, sessionId: number): Promise<AxiosResponse>
    requestInferNextQuestionToFastAPI(
        context: ActionContext<any, any>,
        payload: { answer: string, nextIntent: string }): Promise<string>
}   

const actions: AIInterviewActions = {
    async requestGetQuestionListToDjango(context: ActionContext<any, any>, sessionId: number): Promise<AxiosResponse> {
        const res: AxiosResponse = await axiosInst.djangoAxiosInst.post('/interview/get-session', sessionId)
        return res.data
    },
    async requestInferNextQuestionToFastAPI(
        context: ActionContext<any, any>,
        payload: { answer: string, nextIntent: string }): Promise<string> {
        console.log("payload:", payload)
        const { answer, nextIntent } = payload
        try {
            console.log('requestInferNextQuestionToFastAPI()')
            console.log("userInput:", answer)
            const command = 7

            const response = await axiosInst.fastapiAxiosInst.post(
                '/request-ai-command', { command, "data":[answer, nextIntent] })
            return response.data
        } catch (error) {
            console.log('requestInferToFastAPI() 중 문제 발생:', error)
            throw error
        }
    },
}

export default actions;