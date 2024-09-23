import { ActionContext } from "vuex"
import { Product, ProductState } from "./states"
import { AxiosResponse} from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_PRODUCT_LIST_TO_DJANGO, REQUEST_PRODUCT_TO_DJANGO } from "./mutation-types"

export type ProductActions = {
    requestProductToDjango(
        context: ActionContext<ProductState, any>, 
        productId: number
    ): Promise<void>
    requestProductListToDjango(
        context: ActionContext<ProductState, any>
    ): Promise<void>
}

const actions: ProductActions = {
    async requestProductToDjango(
        context: ActionContext<ProductState, any>, 
        productId: number
    ): Promise<void> {

        try {
            const res: AxiosResponse<Product> = 
                await axiosInst.djangoAxiosInst.get(`/product/read/${productId}`)

            context.commit(REQUEST_PRODUCT_TO_DJANGO, res.data)
        } catch (error) {
            console.error('requestProductToDjango() -> error:', error)
            throw error
        }
    },
    async requestProductListToDjango(context: ActionContext<ProductState, any>): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.get('/product/list/');
            const data: Product[] = res.data;
            // console.log('data:', data)
            context.commit('REQUEST_PRODUCT_LIST_TO_DJANGO', data);
        } catch (error) {
            console.error('Error fetching product list:', error);
            throw error
        }
    },
};

export default actions;