<template>
  <v-container :style="{ maxWidth: '50%' }">
    <v-form ref="form" v-model="valid">
      <v-card-title>
        <form @submit.prevent>
          <v-text-field 
          class="headline"
          label="설문지 이름을 작성하세요."
          v-model="formTitle"
          @keyup.enter="disableEnter"
          :rules="[v => !!v || '설문지 이름을 입력하세요.']"
          required
        ></v-text-field>
        </form>
      </v-card-title>

      <v-btn @click="addQuestion">질문 추가</v-btn>
      <v-select v-if="isAdded"
        v-model="selectedType"
        :items="generateOptions"
        label="질문 유형을 선택하세요"/>

      <v-row>
        <v-col cols="12" v-if="selectedType">
          <v-card  v-if="selectedType === 'text'" outlined>
            <v-card-text>
              <v-text-field
                v-model="answer"
                label="질문을 입력하세요"
                :rules="[v => !!v || '질문을 입력하세요.']"
                required
              ></v-text-field>
              <v-btn @click="createQuestion(selectedType)"> 질문생성하기</v-btn>
            </v-card-text>
          </v-card>

          <v-card  v-if="selectedType === 'radio' || selectedType === 'checkbox'" outlined>
            <v-card-text>
              <v-text-field 
                v-model="answer"
                label="질문을 입력하세요" 
                :rules="[v => !!v || '질문을 입력하세요.']"
                required
              ></v-text-field>

              <v-text-field 
                v-model="option" 
                @keyup.enter="addOption" 
                label="항목을 입력하세요"
                required
                />
              <v-btn @click="addOption"> 항목 생성하기</v-btn>
              <ul>
                <li v-for="(option, index) in optionList" :key="index">{{ option }}</li>
              </ul>
              <v-btn 
                @click="createQuestion(selectedType)"
                > 질문 생성하기</v-btn>
            </v-card-text>
          </v-card>
        </v-col><br>
      </v-row>

      <v-row v-if="questions.length !== 0">질문 폼 미리보기</v-row>
      <v-row v-for="(question, index) in questions" :key="index" class="mb-4">   
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <h4>{{ question.label }}</h4>

              <v-text-field
              v-if="question.type === 'text'"
              v-model="question.answer"
              label="답변을 입력하세요"/>

              <v-radio-group v-if="question.type === 'radio'" v-model="question.answer">
                <v-radio v-for="option in question.options"
                    :key="option"
                    :label="option"
                    :value="option"/>
              </v-radio-group>

              <v-checkbox-group
                v-if="question.type === 'checkbox'"
                v-model="question.answer">
                <v-checkbox
                    v-for="option in question.options"
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
        v-if="questions.length !== 0 && formTitle !== null" 
        :disabled="!valid || questions.length === 0 || formTitle === ''" 
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
        option: '',
        optionList: [], 
        isAdded: false,
        formTitle: null,
        answer: '',
        generateOptions: ['text', 'radio', 'checkbox'],
        selectedType: null, 
        questions: [],
        isFormDirty: false
      };
    },
    methods: {
      createQuestion(selectedType) {
        if (this.answer !== '') {
          if (selectedType !== 'text') {
            if (this.optionList.length !== 0) {
              const form = { label: this.answer, type: selectedType,
                            options: this.optionList, answer:''}
              this.questions.push(form)
              this.answer = ''
              this.optionList=[]
              this.isAdded = false
              this.selectedType = null;
              this.isFormDirty = true; // 폼이 수정됨
              }
            else {
              alert('항목을 입력해주세요.')
            }
            } 
          else {
            const form = { label: this.answer, type: selectedType, answer:''}
            this.questions.push(form)
            this.answer = ''
            this.isAdded = false
            this.selectedType = null;
            this.isFormDirty = true; // 폼이 수정됨
          }
        } else {
          alert('내용을 입력하세요')
        }
      },
      addOption () {
        if (this.option.trim() !== '') {
          this.optionList.push(this.option);
          this.option = ''
          this.isFormDirty = true; // 폼이 수정됨
        }
        else {
          alert('항목에 내용을 입력하세요')
        }
      },
      addQuestion() {
        this.isAdded = true
        this.selectedType = null;
        this.isFormDirty = true; // 폼이 수정됨
      },
      submitForm() {
          const payload = { title: this.formTitle, questions: this.questions };
          console.log('제출된 질문들:', payload);
          alert('제출 완료')
          this.isFormDirty = false;
          this.questions = []
          this.formTitle = null;
    
      },
      disableEnter(event) {
        event.preventDefault();
        event.stopPropagation();
      },
      handleBeforeUnload(event) {
        // 폼이 수정된 경우에만 경고 표시
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
</style>
