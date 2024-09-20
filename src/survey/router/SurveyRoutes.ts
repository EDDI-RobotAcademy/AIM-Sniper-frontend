import SurveyRegisterPage from "@/survey/pages/register/SurveyRegisterPage.vue"
import SurveyReadPage from "@/survey/pages/read/SurveyReadPage.vue"

const SurveyRoutes = [
    {
        path: '/survey/register',
        name: 'SurveyRegisterPage',
        components: {
            default: SurveyRegisterPage,
        },
        props: {
            default: true
        }
    },
    {
        path: '/survey/read/:surveyDocumentId',
        name: 'SurveyReadPage',
        components: {
            default: SurveyReadPage,
        },
        props: {
            default: true
        }
    },
]

export default SurveyRoutes