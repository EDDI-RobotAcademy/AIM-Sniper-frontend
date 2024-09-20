<template>
  <v-container :style="{ maxWidth: '50%' }">
    <v-form ref="form" v-model="valid">
      <v-card-title>
        <form @submit.prevent>
          <v-text-field 
            class="headline"
            label="설문지 이름을 작성하세요."
            v-model="surveyTitle"
            @keyup.enter="disableEnter"
            :rules="[v => !!v || '설문지 이름은 필수 항목입니다']"
            required
          ></v-text-field>
          <v-text-field 
            class="headline"
            label="설문지에 대한 설명을 작성하세요."
            v-model="surveyDescription"
            @keyup.enter="disableEnter"
            :rules="[v => !!v || '설명은 필수 항목입니다']"
            aria-required=""
          ></v-text-field>
        </form>
      </v-card-title>

      <v-btn @click="addQuestion">질문 추가</v-btn>
      <v-select v-if="isAdded"
        v-model="questionType"
        :items="generateOptions"
        label="질문 유형을 선택하세요"/>

      <v-row>
        <v-col cols="12" v-if="questionType">
          <v-card v-if="questionType === 'text'" outlined>
            <v-card-text>
              <v-checkbox
                v-model="isEssential"
                label="이 질문을 필수 항목으로 설정합니다."
                @change="isEssentialQuestion"
              />
              <v-text-field
                v-model="questionTitle"
                label="질문 제목을 입력하세요"
                :rules="[v => !!v || '질문 제목은 필수 항목입니다.']"
                required
              ></v-text-field>
              <v-btn @click="createQuestion(questionType)"> 질문 생성</v-btn>
            </v-card-text>
          </v-card>

          <v-card v-if="questionType === 'radio' || questionType === 'checkbox'" outlined>
            <v-card-text>
              <v-checkbox
                v-model="isEssential"
                label="이 질문을 필수 항목으로 설정합니다."
                @change="isEssentialQuestion"
              />
              <v-text-field 
                v-model="questionTitle"
                label="질문 제목을 입력하세요" 
                :rules="[v => !!v || '질문 제목은 필수 항목입니다.']"
                required
              ></v-text-field>

              <v-text-field 
                v-model="option" 
                @keyup.enter="addOption" 
                label="항목 이름을 입력하세요"
                required
              />
              <v-btn @click="addOption"> 항목 생성하기</v-btn>
              <ul>
                <li v-for="(option, index) in questionOptions" :key="index">{{ option }}</li>
              </ul>
              <v-btn 
                @click="createQuestion(questionType)"
              > 질문 생성하기</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <br><br><br>
      <v-row v-if="surveyQuestions.length !== 0">
        <v-card-title>
          <span>설문 폼 미리보기</span><br><br>
          <span class="headline">{{ surveyTitle }}</span>
          <v-card-subtitle class="survey-subtitle">
            <span>{{ surveyDescription }}</span>
          </v-card-subtitle>
        </v-card-title>
      </v-row>
      <v-row v-for="(question, index) in surveyQuestions" :key="index" class="mb-4">   
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <h4 v-html="formatQuestionTitle(index, question)"></h4>

              <v-text-field
                v-if="question.questionType === 'text'"
                label="답변을 입력하세요"/>

              <v-radio-group v-if="question.questionType === 'radio'" v-model="question.answer">
                <v-radio v-for="option in question.questionOptions"
                  :key="option"
                  :label="option"
                  :value="option"/>
              </v-radio-group>

              <v-checkbox-group
                v-if="question.questionType === 'checkbox'" v-model="question.answer">
                <v-checkbox
                  v-for="option in question.questionOptions"
                  :key="option"
                  :label="option"
                  :value="option"
                ></v-checkbox>
              </v-checkbox-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-btn 
        v-if="surveyQuestions.length !== 0 && surveyTitle !== null" 
        :disabled="!valid || surveyQuestions.length === 0 || surveyTitle === ''" 
        @click="submitForm" 
        color="primary"
      >제출</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      surveyTitle: null,
      surveyDescription: null,
      surveyQuestions: [],
      option: '',
      questionTitle: '',
      questionType: null,
      questionOptions: [], 
      isAdded: false,
      isEssential: false,
      generateOptions: ['text', 'radio', 'checkbox'],
      isFormDirty: false
    };
  },
  methods: {
    createQuestion(questionType) {
      if (this.questionTitle !== '') {
        if (questionType !== 'text') {
          if (this.questionOptions.length !== 0) {
            const form = { questionTitle: this.questionTitle, questionType: questionType, questionOptions: this.questionOptions, isEssential: this.isEssential };
            this.surveyQuestions.push(form);
            this.resetQuestionFields();
          } else {
            alert('항목을 입력해주세요.');
          }
        } else {
          const form = { questionTitle: this.questionTitle, questionType: questionType, questionOptions: null, isEssential: this.isEssential };
          this.surveyQuestions.push(form);
          this.resetQuestionFields();
        }
      } else {
        alert('내용을 입력하세요');
      }
    },
    resetQuestionFields() {
      this.questionTitle = '';
      this.questionOptions = [];
      this.isAdded = false;
      this.questionType = null;
      this.isEssential = false;
      this.isFormDirty = true;
    },
    addOption() {
      if (this.option.trim() !== '') {
        this.questionOptions.push(this.option);
        this.option = '';
        this.isFormDirty = true;
      } else {
        alert('항목에 내용을 입력하세요');
      }
    },
    addQuestion() {
      this.isAdded = true;
      this.questionType = null;
      this.isFormDirty = true; 
    },
    isEssentialQuestion() {
      this.isEssential = true;
    },
    submitForm() {
      const payload = { surveyTitle: this.surveyTitle, surveyDescription: this.surveyDescription, surveyQuestions: this.surveyQuestions };
      console.log('제출된 질문들:', payload);
      alert('제출 완료');
      this.isFormDirty = false;
      this.surveyQuestions = [];
      this.surveyTitle = null;
      this.surveyDescription = null;
    },
    formatQuestionTitle(index, question) {
        return `${index +1}. ${question.questionTitle} <span class="essential">${question.isEssential ? '* 필수' : '* 선택'}</span>`;
      },
    disableEnter(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    handleBeforeUnload(event) {
      if (this.isFormDirty) {
        const confirmationMessage = '작성 중인 정보가 저장되지 않을 수 있습니다.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
};
</script>

<style>
.headline {
  font-size: 30px;
  font-weight: bold;
}

.pre-title { 
  margin-top: 5%;
  text-align: start;
}

.survey-subtitle {
  max-width: 600px; /* 서브타이틀의 최대 너비를 설정 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
  word-break: break-all; /* 단어가 길 경우 중간에 자르기 */
}

.essential {
  font-size: 0.8em; /* 크기를 작게 설정 */
  color: orange; /* 주황색으로 설정 */
}
</style>
