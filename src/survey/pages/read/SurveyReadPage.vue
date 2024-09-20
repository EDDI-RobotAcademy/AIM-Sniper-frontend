<template>
    <v-container>
      <v-card class="mx-auto my-12" max-width="800">
        <v-card-title>
          <span class="headline">{{ surveyTitle }}</span>
        </v-card-title>
        <v-card-subtitle>
          <span>{{ surveyDescription }}</span>
        </v-card-subtitle>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row v-for="(question, index) in surveyQuestions" :key="index" class="mb-4">
              <v-col cols="12">
                <v-card outlined>
                  <v-card-text>
                    <h4 v-html="formatQuestionTitle(index, question)"></h4>
  
                    <v-text-field
                      v-if="question.questionType === 'text'"
                      v-model="surveyQuestions[index].answer"
                      label="답변을 입력하세요"
                      :rules="question.isEssential ? [rules.textRequired] : []"
                      @input="updateSubmitForm(index, surveyQuestions[index].answer)"
                    />
  
                    <v-radio-group
                      v-if="question.questionType === 'radio'"
                      v-model="surveyQuestions[index].answer"
                      :rules="question.isEssential ? [rules.radioRequired] : []"
                      @change="updateSubmitForm(index, surveyQuestions[index].answer)"
                    >
                      <v-radio
                        v-for="option in question.questionOptions"
                        :key="option"
                        :label="option"
                        :value="option"
                      />
                    </v-radio-group>
  
                    <v-checkbox-group
                      v-if="question.questionType === 'checkbox'">
                      <v-checkbox
                        v-for="option in question.questionOptions"
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
  export default {
    data() {
      return {
        valid: false,
        rules: {
          textRequired: (value) => !!value || '필수 입력 항목입니다.',
          radioRequired: (value) => !!value || '옵션을 선택해주세요.',
        },
        surveyTitle: '설문지 제목입니다',
        surveyDescription: '설문지 설명입니다',
        surveyQuestions: [
          { questionTitle: '질문 1번입니다', questionType: 'text', answer: '', isEssential: true },
          { questionTitle: '질문 2번입니다', questionType: 'radio', answer: '', questionOptions: ['1번 항목', '2번 항목'], isEssential: true },
          { questionTitle: '질문 3번입니다', questionType: 'checkbox', answer: [], questionOptions: ['1번 항목', '2번 항목'], isEssential: true },
          { questionTitle: '질문 4번입니다. 선택사항', questionType: 'text', answer: '', isEssential: false }, 
        ],
        submitForm: [],
      };
    },
    methods: {
      isChecked(index, option) {
        return this.surveyQuestions[index].answer.includes(option);
      },
  
      toggleCheckbox(index, option) {
        const answerArray = this.surveyQuestions[index].answer;
        const optionIndex = answerArray.indexOf(option);
        if (optionIndex === -1) {
          answerArray.push(option);
        } else {
          answerArray.splice(optionIndex, 1);
        }
  
        this.updateCheckboxSubmitForm(index);
      },
  
      updateCheckboxSubmitForm(index) {
        const answerArray = [...this.surveyQuestions[index].answer];
        this.submitForm = this.submitForm.filter((item) => item.index !== index);
        this.submitForm.push({ index, answer: answerArray });
      },
  
      updateSubmitForm(index, answer) {
        this.submitForm = this.submitForm.filter((item) => item.index !== index);
        this.submitForm.push({ index, answer });
      },
  
      formatQuestionTitle(index, question) {
        return `${index +1}. ${question.questionTitle} <span class="essential">${question.isEssential ? '* 필수' : '* 선택'}</span>`;
      },
  
      async onSubmit() {
        let isValid = true;
        this.surveyQuestions.forEach((question, index) => {
          if (question.isEssential && question.questionType === 'checkbox' && question.answer.length === 0) {
            isValid = false;
            alert('필수 작성 항목을 점검해주세요.');
          }
        });
  
        // 나머지 유효성 검사
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

  .essential {
  font-size: 0.8em; /* 크기를 작게 설정 */
  color: orange; /* 주황색으로 설정 */
}
  </style>
  