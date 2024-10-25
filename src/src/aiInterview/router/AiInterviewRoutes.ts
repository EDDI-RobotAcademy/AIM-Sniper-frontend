import AiInterviewPage from "@/aiInterview/pages/AiInterviewPage.vue"
import AIInterviewLLMTestPage from "@/aiInterview/pages/llmTest/AIInterviewLLMTestPage.vue"
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
]

export default AiInterviewRoutes