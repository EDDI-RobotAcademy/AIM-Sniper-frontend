import AiInterviewPage from "@/aiInterview/pages/AiInterviewPage.vue"
import AIInterviewLLMTestPage from "@/aiInterview/pages/llmTest/AIInterviewLLMTestPage.vue"
import AIInterviewAnswerResultPage from "@/aiInterview/pages/result/AIInterviewAnswerResultPage.vue"
const AiInterviewRoutes = [
    {
        path: '/ai-interview',
        name: 'AiInterviewPage',
        components: {
            default: AiInterviewPage
        }
    },
    {
        path: '/ai-interview/llmTest',
        name: 'AIInterviewLLMTestPage',
        components: {
            default: AIInterviewLLMTestPage
        }
    },
    {
        path: '/ai-interview/result',
        name: 'AIInterviewAnswerResult.vue',
        components: {
            default: AIInterviewAnswerResultPage
        }
    },
]

export default AiInterviewRoutes