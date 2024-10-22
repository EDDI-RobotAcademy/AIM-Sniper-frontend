import { ActionContext } from "vuex"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type AIInterviewActions = {
    requestGetQuestionListToDjango(context: ActionContext<any, any>, sessionId: number): Promise<AxiosResponse>
    requestInferNextQuestionToFastAPI(
        context: ActionContext<any, any>,
        payload: { answer: string, nextIntent: string }): Promise<string>
    requestInferedResultToFastAPI(context: ActionContext<any, any>): Promise<string>
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
            // console.log('requestInferNextQuestionToFastAPI()')
            // console.log("userInput:", answer)
            const command = 7

            const response = await axiosInst.fastapiAxiosInst.post(
                '/request-ai-command', { command, "data":[answer, nextIntent] })
            return response.data
        } catch (error) {
            console.log('requestInferToFastAPI() 중 문제 발생:', error)
            throw error
        }
    },

    async requestInferedResultToFastAPI(context: ActionContext<any, any>): Promise<string> {
        try {
            // console.log('requestInferedResultToFastAPI()')

            let response: AxiosResponse<any>;
            const maxAttempts = 30; // 최대 시도 횟수
            const delay = 1000; // 각 시도 사이의 지연시간 (ms)
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                response = await axiosInst.fastapiAxiosInst.get('/polyglot-result');

                if (response.data && response.data.nextQuestion) {
                    // console.log('response.data', response.data);
                    return response.data;
                }

                console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            throw new Error('결과를 가져오는 데 실패했습니다.');
        } catch (error) {
            console.log('requestInferedResultToFastAPI() 중 문제 발생:', error)
            throw error
        }
    },
}

export default actions;