import { MutationTree } from "vuex";
import { SurveyState, Survey } from "./states";
import { REQUEST_SURVEY_LIST_TO_DJANGO, REQUEST_SURVEY_FORM_TO_DJANGO} from "./mutation-types";

export interface SurveyMutations extends MutationTree<SurveyState> {
    [REQUEST_SURVEY_LIST_TO_DJANGO] (state: SurveyState, receivedData: []): void
    [REQUEST_SURVEY_FORM_TO_DJANGO] (state: SurveyState, receivedData: Survey): void
}

const mutations: MutationTree<SurveyState> = {
    [REQUEST_SURVEY_LIST_TO_DJANGO] (state: SurveyState, receivedData: []): void {
        state.surveyTitleList = receivedData
    },
    [REQUEST_SURVEY_FORM_TO_DJANGO] (state: SurveyState, receivedData: Survey): void{
        state.surveyForm = receivedData
    }
}

export default mutations as SurveyMutations