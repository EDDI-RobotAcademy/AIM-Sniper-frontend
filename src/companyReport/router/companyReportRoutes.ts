import CompanyReportListPage from '@/companyReport/pages/list/CompanyReportListPage.vue'
import CompanyReportRegisterPage from '../pages/register/CompanyReportRegisterPage.vue'
import CompanyReportReadPage from '../pages/read/CompanyReportReadPage.vue'

const CompanyReportRoutes = [
    {
        path: '/companyReport/list',
        name: 'CompanyReportListPage',
        component: CompanyReportListPage,
    },
    {
        path: '/companyReport/register',
        name: 'CompanyReportRegisterPage',
        component: CompanyReportRegisterPage,
    },
    {
        path: '/companyReport/read/:companyReportId',
        name: 'CompanyReportReadPage',
        components: {
            default: CompanyReportReadPage
        },
        props: {
            default: true
        },
    },
]

export default CompanyReportRoutes