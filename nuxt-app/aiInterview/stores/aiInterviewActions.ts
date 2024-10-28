import * as axiosUtility from "../../utility/axiosInstance";
import { AxiosResponse } from "axios"
import { useAiInterviewStore } from "./aiInterviewStore"

export const aiInterviewActions = {
    
    async requestGetQuestionListToDjango(sessionId: number): Promise<AxiosResponse> {
        const { djangoAxiosInst } = axiosUtility.createAxiosInstances();

        try {
            const res: AxiosResponse = await djangoAxiosInst.post('/interview/get-session', sessionId)
            return res.data
        } catch (err) {
            console.error('requestGetQuestionListToDjango() -> error:', err)
            throw err
        }        
    },
    async requestInferNextQuestionToFastAPI(payload: { answer: string, nextIntent: string }): Promise<string> {
        const { fastapiAxiosInst } = axiosUtility.createAxiosInstances();
        console.log("payload:", payload)
        const { answer, nextIntent } = payload
        
        try {
            // console.log('requestInferNextQuestionToFastAPI()')
            // console.log("userInput:", answer)
            const command = 7

            const response = await fastapiAxiosInst.post(
                '/request-ai-command', { command, "data":[answer, nextIntent] })
            return response.data
        } catch (error) {
            console.log('requestInferToFastAPI() 중 문제 발생:', error)
            throw error
        }
    },

    async requestInferedResultToFastAPI(): Promise<string> {
        const { fastapiAxiosInst } = axiosUtility.createAxiosInstances();
        try {
            // console.log('requestInferedResultToFastAPI()')

            let response: AxiosResponse<any>;
            const maxAttempts = 30; // 최대 시도 횟수
            const delay = 1000; // 각 시도 사이의 지연시간 (ms)
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                response = await fastapiAxiosInst.get('/polyglot-result');

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
};