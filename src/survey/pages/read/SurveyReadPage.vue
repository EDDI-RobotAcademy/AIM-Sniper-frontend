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
                      v-model="surveyForm.surveyQuestions[index].answer"
                      label="답변을 입력하세요"
                      :rules="question.isEssential ? [rules.textRequired] : []"
                      @input="updateSubmitForm(index, surveyForm.surveyQuestions[index].answer)"
                    />
  
                    <v-radio-group
                      v-if="question.questionType === 'radio'"
                      v-model="surveyForm.surveyQuestions[index].answer"
                      :rules="question.isEssential ? [rules.radioRequired] : []"
                      @change="updateSubmitForm(index, surveyForm.surveyQuestions[index].answer)"
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
                        @change="toggleCheckbox(index, option)"
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
        surveyDocumentId: {
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
        this.requestSurveyFormToDjango(this.surveyDocumentId)
    },
    methods: {
      ...mapActions(surveyModule, ['requestSurveyFormToDjango']),

      isChecked(index, option) {
        return this.surveyForm.surveyQuestions[index].answer.includes(option);
      },
  
      toggleCheckbox(index, option) {
        const answerArray = this.surveyForm.surveyQuestions[index].answer;
        const optionIndex = answerArray.indexOf(option);
        if (optionIndex === -1) {
          answerArray.push(option);
        } else {
          answerArray.splice(optionIndex, 1);
        }
  
        this.updateCheckboxSubmitForm(index);
      },
  
      updateCheckboxSubmitForm(index) {
        const answerArray = [...this.surveyForm.surveyQuestions[index].answer];
        this.submitForm = this.submitForm.filter((item) => item.index !== index);
        this.submitForm.push({ index, answer: answerArray });
      },
  
      updateSubmitForm(index, answer) {
        this.submitForm = this.submitForm.filter((item) => item.index !== index);
        this.submitForm.push({ index, answer });
      },
  
      formatQuestionTitle(index, question) {
        if (question.questionType === 'checkbox') {
        return `${index +1}. ${question.questionTitle} (중복 선택 가능) <span class="essential"> ${question.isEssential ? '* 필수' : '* 선택'}</span>`;
        }
        else {
            return `${index +1}. ${question.questionTitle} <span class="essential">${question.isEssential ? '* 필수' : '* 선택'}</span>`;
        }
      },
  
      async onSubmit() {
        let isValid = true;
        this.surveyForm.surveyQuestions.forEach((question, index) => {
          if (question.isEssential && question.questionType === 'checkbox' && question.answer.length === 0) {
            isValid = false;
            alert('필수 작성 항목을 점검해주세요.');
          }
        });
  
        isValid = await this.$refs.form.validate() && isValid;
  
        if (isValid) {
          console.log('전달될 데이터', this.submitForm);
          alert('제출이 완료되었습니다.');
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
  