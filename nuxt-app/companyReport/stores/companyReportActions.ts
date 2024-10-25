import * as axiosUtility from "../../utility/axiosInstance";
import { useCompanyReportStore } from "./companyReportStore";

export const companyReportActions = {
	async requestCompanyReportToDjango(companyReportId: number): Promise<void> {
		const { djangoAxiosInst } = axiosUtility.createAxiosInstances();
		const companyReportStore = useCompanyReportStore();

        try {
            const res = await djangoAxiosInst.get(`/company_report/read/${companyReportId}`);
			companyReportStore.companyReport = res.data;
        } catch (error) {
            console.error('requestCompanyReportToDjango() -> error:', error);
            throw error;
        }
    },

	async requestCompanyReportListToDjango(): Promise<void> {
		const { djangoAxiosInst } = axiosUtility.createAxiosInstances();
		const companyReportStore = useCompanyReportStore();

		try {
			const res = await djangoAxiosInst.get('/company_report/list/');
			const data = res.data;
			console.log('Report Total data Complete');
			companyReportStore.companyReportList = data;
		} catch (error) {
			console.error('Error fetching companyReport list:', error);
			throw error;
		}
	},


	async requestTopNCompanyReportListToDjango(topN: number): Promise<void> {
		const { djangoAxiosInst } = axiosUtility.createAxiosInstances();
		
		try {
			return await djangoAxiosInst.post('company_report/top', { params: { topN } });
		} catch (error) {
			console.log('requestTopNCompanyReportListToDjango() -> error:', error);
			throw error;
		}
	},
};