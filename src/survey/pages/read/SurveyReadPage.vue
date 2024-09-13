<template>
  <v-container>
    <v-card class="mx-auto my-12" max-width="800">
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-card-subtitle>
        <span>아래 설문을 작성해 주세요.</span>
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row v-for="(question, index) in questions" :key="index" class="mb-4">
            <v-col cols="12">
              <v-card outlined>
                <v-card-text>
                  <h4>{{ index + 1 }}. {{ question.label }}</h4>

                  <v-text-field
                    v-if="question.type === 'text'"
                    v-model="question.answer"
                    label="답변을 입력하세요"
                    :rules="[rules.required]"
                    @input="updateList(question.type, index, question.answer)" />

                  <v-radio-group v-if="question.type === 'radio'" v-model="question.answer" @change="updateList(question.type, index, question.answer)">
                    <v-radio v-for="option in question.options"
                      :key="option"
                      :label="option"
                      :value="option" />
                  </v-radio-group>

                  <v-checkbox-group
                    v-if="question.type === 'checkbox'"
                    v-model="checkOption" @change="updateList(question.type, index, question.answer)">
                    <v-checkbox
                      v-for="option in question.options"
                      :key="option"
                      :label="option"
                      :value="option" />
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
              :disabled="!valid">
              <v-icon left>mdi-check</v-icon>
              <p>작성 완료</p>
            </v-btn>
          </v-col>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  const surveyModule = 'surveyModule'

  export default {
    data() {
      return {
        valid: false,
        rules: {
          required: value => !!value || '필수 입력 항목입니다.'
        },
        formTitle: '설문지',
        questions: [
          { label: '질문 1번입니다', type: 'text', answer: '' },
          { label: '질문 2번입니다', type: 'radio', answer: '', options: ['1번 항목', '2번 항목'] },
          { label: '질문 3번입니다', type: 'checkbox', answer: [], options: ['1번 항목', '2번 항목'] }
        ],
        list: [],
        checkOption: ''
      }
    },
    methods: {
      ...mapActions(surveyModule, ['requestCreateSurveyFormToDjango']),
      updateList(questionType, index, answer) {
        // 현재 리스트에서 해당 질문의 항목을 제거
        this.list = this.list.filter(item => item.index !== index);

        if (questionType === 'checkbox') {
          console.log('체크된 항목:', answer);
          this.list.push({ index: index, answer: [...answer] });
        } else {
          this.list.push({ index: index, answer: answer });
        }

        console.log('list', this.list);
      },
      async onSubmit() {
        const isValid = await this.$refs.form.validate();
        if (isValid) {
          console.log('전달될 데이터', this.list);
          alert('제출이 완료되었습니다.');
          this.list = [];
          // window.location.reload();
          // 폼 제출 로직 추가
        }
      }
    }
  }
</script>

<style scoped>
  .headline {
    font-weight: bold;
  }
</style>
