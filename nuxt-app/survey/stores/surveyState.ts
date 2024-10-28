export const surveyState = () => ({
    surveyTitleList: [] as string[],
    surveyForm: null as Survey | null,
    resultForm: null as any,
});

export interface Survey {
    surveyId: number;
    surveyTitle: string;
    surveyDescription: string;
    surveyQuestions: any[];
    randomString: string;
}
