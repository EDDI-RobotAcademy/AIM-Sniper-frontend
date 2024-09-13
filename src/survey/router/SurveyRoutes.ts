import SurveyRegisterPage from "@/survey/pages/register/SurveyRegisterPage.vue"
import SurveyReadPage from "@/survey/pages/read/SurveyReadPage.vue"

const SurveyRoutes = [
    {
        path: '/survey/register',
        name: 'SurveyRegisterPage',
        component: SurveyRegisterPage,
    },
    {
        path: '/survey/read',
        name: 'SurveyReadPage',
        component: SurveyReadPage,
    },
]

export default SurveyRoutes