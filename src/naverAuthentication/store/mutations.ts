import { MutationTree } from "vuex";
import { NaverAuthenticationState } from "./states"
import { REQUEST_IS_NAVER_AUTHENTICATED_TO_DJANGO } from "./mutation-types"

export interface NaverAuthenticationMutations extends MutationTree<NaverAuthenticationState> {
    [REQUEST_IS_NAVER_AUTHENTICATED_TO_DJANGO](state: NaverAuthenticationState, settingValue: boolean): void
}

const mutations: MutationTree<NaverAuthenticationState> = {
    [REQUEST_IS_NAVER_AUTHENTICATED_TO_DJANGO](state: NaverAuthenticationState, settingValue: boolean): void {
        state.isAuthenticatedNaver = settingValue
    }
}

export default mutations as NaverAuthenticationMutations