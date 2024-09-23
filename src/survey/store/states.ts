export interface SurveyState {
    surveyTitleList: Survey[]
    surveyForm: Survey | null
}

export interface Survey {
    surveyDocumentId: number
    surveyTitle: string
    surveyDescription: string
    surveyQuestions: []
}

const state: SurveyState = {
    surveyTitleList: [],
    surveyForm: null
}

export default state