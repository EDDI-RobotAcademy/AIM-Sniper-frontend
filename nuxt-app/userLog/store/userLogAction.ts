import * as axiosUtility from "../../utility/axiosInstance"
import { useUserLogStore } from "./userLogStore"

export const userLogActions = {
    async requestCountClickToDjango(companyReport_id: string, purchase: boolean, email:string): Promise<any> {
        const { djangoAxiosInst } = axiosUtility.createAxiosInstances()
        const userLogStore = useUserLogStore()

        try {
            djangoAxiosInst.post('/marketing/make-count', {
                email: email,
                companyReport_id: companyReport_id,
                purchase: purchase
            });
        } catch (error) {
            console.error('Error fetching userLog request:', error)
			throw error
        }
    },
};
