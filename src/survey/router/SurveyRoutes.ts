import SurveyRegisterPage from "@/survey/pages/register/SurveyRegisterPage.vue"
import SurveyReadPage from "@/survey/pages/read/SurveyReadPage.vue"
import SurveyCreatedPage from "@/survey/pages/created/SurveyCreatedPage.vue"
import SurveyListPage from "@/survey/pages/list/SurveyListPage.vue"
import SurveySubmittedPage from "@/survey/pages/submitted/SurveySubmittedPage.vue"
const SurveyRoutes = [
    {
        path: '/survey/register',
        name: 'SurveyRegisterPage',
        component: SurveyRegisterPage
    },
    {
        path: '/survey/read/:surveyId',
        name: 'SurveyReadPage',
        components: {
            default: SurveyReadPage,
        },
        props: {
            default: true
        }
    },
    {
        path: '/survey/created',
        name: 'SurveyCreatedPage',
        component: SurveyCreatedPage
    },
    {
        path: '/survey/list',
        name: 'SurveyListPage',
        component: SurveyListPage
    },
    {
        path: '/survey/submitted',
        name: 'SurveySubmittedPage',
        component: SurveySubmittedPage
    },
]

export default SurveyRoutes