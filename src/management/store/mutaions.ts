import { MutationTree } from "vuex";
import { User, UserLog, ManagementState } from "./states";
import { REQUEST_USER_LIST_TO_DJANGO,
        REQUEST_USER_LOG_LIST_TO_DJANGO
       } from "./mutation-types";

export interface ManagementMutations extends MutationTree<ManagementState> {
    [REQUEST_USER_LIST_TO_DJANGO] (state: ManagementState, receivedData: User[]): void
}

const mutations: MutationTree<ManagementState> = {
    [REQUEST_USER_LIST_TO_DJANGO] (state: ManagementState, receivedData: User[]): void {
        state.userList = receivedData},
}

export default mutations as ManagementMutations