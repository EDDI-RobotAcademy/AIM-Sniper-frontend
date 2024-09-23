export interface SurveyState {
    surveyList: Survey[]
    survey: Survey | null
}

export interface Survey {
    surveyDocumentId: number
    title: string
}

const state: SurveyState = {
    surveyList: [],
    survey: null
}

export default state