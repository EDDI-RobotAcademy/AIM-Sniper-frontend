import state, { AiInterviewState } from "./states"


export interface AiInterviewModule {
    namespaced: true
    state: AiInterviewState
}

const aiInterviewModule: AiInterviewModule = {
    namespaced: true,
    state,
}

export default aiInterviewModule