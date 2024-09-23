<template>
    <v-container>
      <v-card class="mx-auto my-12" max-width="800" v-if="surveyForm">
        <v-card-title>
          <span class="headline">{{ surveyForm.surveyTitle }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span>{{ surveyForm.surveyDescription }}</span>
        </v-card-subtitle>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row v-for="(question, index) in surveyForm.surveyQuestions" :key="index" class="mb-4">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-text>
                    <h4 v-html="formatQuestionTitle(index, question)"></h4>
  
                    <v-text-field
                      v-if="question.questionType === 'text'"
                      v-model="question.answer"
                      label="답변을 입력하세요"
                      :rules="question.essential ? [rules.textRequired] : []"
                      @input="updateSubmitForm(question.questionType, question.questionId, question.answer, null)"
                    />
  
                    <v-radio-group
                      v-if="question.questionType === 'radio'"
                      v-model="question.answer"
                      :rules="question.essential ? [rules.radioRequired] : []"
                      @change="updateSubmitForm(question.questionType, question.questionId, question.answer, question.selection)"
                    >
                    <v-radio
                        v-for="option in question.selection"
                        :key="option"
                        :label="option"
                        :value="option"
                      />
                    </v-radio-group>
  
                    <v-checkbox-group
                      v-if="question.questionType === 'checkbox'">
                      <v-checkbox
                        v-for="option in question.selection"
                        :key="option"
                        :label="option"
                        :value="option"
                        :input-value="isChecked(index, option)"
                        @change="toggleCheckbox(question.questionType, question.questionId, question.answer, option, question.selection)"
                      />
                    </v-checkbox-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-col cols="12" class="text-right">
              <v-btn
                class="ml-2"
                color="primary"
                @click="onSubmit"
                :disabled="!valid"
              >
                <v-icon left>mdi-check</v-icon>
                작성 완료
              </v-btn>
            </v-col>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
import { mapActions, mapState } from 'vuex'
const surveyModule = 'surveyModule'

export default {
    props: {
        surveyId: {
            type: String,
            required: true,
        }
    },
    data() {
      return {
        valid: false,
        rules: {
          textRequired: (value) => !!value || '필수 입력 항목입니다.',
          radioRequired: (value) => !!value || '옵션을 선택해주세요.',
        },
        submitForm: [],
      };
    },
    computed: {
        ...mapState(surveyModule, ['surveyForm'])
    },
    created () {
        this.requestSurveyFormToDjango(this.surveyId)
    },
    methods: {
        
      ...mapActions(surveyModule, ['requestSurveyFormToDjango', 'requestSubmitSurveyToDjango']),

      isChecked(index, selection) {
        return this.surveyForm.surveyQuestions[index].answer.includes(selection);
      },
  
      toggleCheckbox(questionType, questionId, answer, option, selection) {
        const answerArray = answer.indexOf(option);
        if (answerArray === -1) {
          answer.push(option);
        } else {
          answer.splice(answerArray, 1);
        }
  
        this.updateCheckboxSubmitForm(questionType, questionId, answer, selection);
      },
  
      updateCheckboxSubmitForm(questionType, questionId, answer, selection) {
        const answerArray = [...answer];
        const selectionIdArray = []
        for (const answer of answerArray) {
            selectionIdArray.push(selection.indexOf(answer) + 1);
        }
        this.submitForm = this.submitForm.filter((item) => item.questionId !== questionId);
        this.submitForm.push({ questionId, selectionIdArray, questionType });
      },
  
      updateSubmitForm(questionType, questionId, answer, selection) {
        this.submitForm = this.submitForm.filter((item) => item.questionId !== questionId);
        if (selection !== null) {
            const selectionId = selection.indexOf(answer) + 1;
            this.submitForm.push({ questionId, selectionId, questionType});
        }
        else {
            this.submitForm.push({ questionId, answer, questionType });
        }
      },
  
      formatQuestionTitle(index, question) {
        if (question.questionType === 'checkbox') {
        return `${index +1}. ${question.questionTitle} (중복 선택 가능) <span class="essential"> ${question.essential ? '* 필수' : '* 선택'}</span>`;
        }
        else {
            return `${index +1}. ${question.questionTitle} <span class="essential">${question.essential ? '* 필수' : '* 선택'}</span>`;
        }
      },
  
      async onSubmit() {
        console.log("surveyForm : ", this.surveyForm)
        let isValid = true;
        this.surveyForm.surveyQuestions.forEach((question, index) => {
          if (question.essential && question.questionType === 'checkbox' && question.answer.length === 0) {
            isValid = false;
            alert('필수 작성 항목을 점검해주세요.');
          }
        });
  
        isValid = await this.$refs.form.validate() && isValid;
  
        if (isValid) {
          console.log('전달될 데이터', this.submitForm);
          const payload = {submitForm: this.submitForm}
          const isSubmitted = await this.requestSubmitSurveyToDjango(payload)
          if (isSubmitted) {
            alert('제출이 완료되었습니다.');
          }
          this.submitForm = [];
        }
      }
    },
  };
</script>
  
<style scoped>
.headline {
    font-weight: bold;
  }

.pre-title { 
  margin-top: 5%;
  text-align: start;
}

.survey-subtitle {
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-all;
}

.essential {
  font-size: 0.8em;
  color: rgb(255, 123, 0);
}
  </style>
  