import actions, { SurveyActions } from "./actions"

export interface SurveyModule {
    namespaced: true
    // state: SurveyState
    actions: SurveyActions
}

const surveyModule: SurveyModule = {
    namespaced: true,
    // state,
    actions,
}

export default surveyModule