<template>
  <v-container :style="{ maxWidth: '50%' }">
    <v-container v-if="start" align="center">
      <v-btn @click="createForm">설문 조사 제작하기</v-btn>
    </v-container>
    <v-form v-if="formCreated" ref="form" v-model="valid">
      <v-card-title>
        <form v-if="showTitleDescription" @submit.prevent>
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
          <v-btn 
          :disabled="surveyTitle === null || surveyTitle === '' || 
            surveyDescription === null || surveyDescription ===''" 
          @click="sendTitleAndDescription">완료</v-btn>
        </form>
      </v-card-title>

      <v-btn v-if="titleAndDescriptionCreated" @click="addQuestion">질문 추가</v-btn>
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
              />
              <v-text-field
                v-model="questionTitle"
                label="질문 제목을 입력하세요"
                :rules="[v => !!v || '질문 제목은 필수 항목입니다.']"
                required
              ></v-text-field>
              <v-row>
                <v-col cols="8">
                  <v-file-input
                    v-model="uploadedImage"
                    label="사진 등록"
                    multiple
                    @change="onFileChange(uploadedImage)"
                  />
                  <v-container v-if="uploadedImages.length !== 0">
                    <ul>
                      <li class="li-margin" v-for="(image, index) in uploadedImages" :key="index">{{ image.name }}</li>
                    </ul>
                  </v-container>
                </v-col>
              </v-row>
              <v-btn :disabled="questionTitle === null || questionTitle === ''" 
              @click="createQuestion(questionType)">완료</v-btn>
            </v-card-text>
          </v-card>

          <v-card v-if="questionType === 'radio' || questionType === 'checkbox'" outlined>
            <v-card-text>
              <v-checkbox
                v-model="isEssential"
                label="이 질문을 필수 항목으로 설정합니다."
              />
              <v-text-field 
                v-model="questionTitle"
                label="질문 제목을 입력하세요" 
                :rules="[v => !!v || '질문 제목은 필수 항목입니다.']"
                required
              ></v-text-field>
              <v-row>
                <v-col cols="8">
                  <v-file-input
                    v-model="uploadedImage"
                    label="사진 등록"
                    multiple
                    @change="onFileChange(uploadedImage)"
                  />
                  <v-container v-if="uploadedImages.length !== 0">
                    <ul>
                      <li class="li-margin" v-for="(image, index) in uploadedImages" :key="index">{{ image.name }}</li>
                    </ul>
                  </v-container>
                </v-col>
              </v-row>
              <v-btn v-if="readyToCreateQuestionTitle" 
              :disabled="questionTitle === null || questionTitle === ''" 
              @click="createQuestion(questionType)">질문 생성</v-btn>
              <v-text-field v-if="!readyToCreateQuestionTitle"
                v-model="option" 
                @keyup.enter="createSelection" 
                label="항목 이름을 입력하세요"
                required
              />
              <v-btn v-if="!readyToCreateQuestionTitle" @click="createSelection"> 항목 생성</v-btn>
              <br>
              <ul><br>
                <li class="li-margin" v-for="(option, index) in selection" :key="index">{{ option }}</li>
              </ul><br>
              <v-btn v-if="selection.length!==0" @click="finishCreateSelection">완료</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <br><br><br><br><br>
      <hr class="tuning-hr" v-if="surveyQuestions.length !== 0"><br>
      <v-row v-if="surveyQuestions.length !== 0">
        <v-card-title>
          <span>설문 폼 미리보기</span><br><br><br>
          <span class="headline">{{ surveyTitle }}</span>
          <v-card-subtitle class="survey-subtitle">
            <br>
            <span>{{ surveyDescription }}</span>
          </v-card-subtitle>
        </v-card-title>
      </v-row>
      <v-row v-for="(question, index) in surveyQuestions" :key="index" class="mb-4">   
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <h4 v-html="formatQuestionTitle(index, question)"></h4><br>
              <v-row v-if="question.images.length !==0">
                <v-col v-for="(image, index) in question.images" :key="index" cols="4" class="mb-4">
                  <span>추가된 이미지 {{ image.name }}</span>
                  <!-- <v-img :src="getImageUrl(image.name)" aspect-ratio="1.0" contain></v-img> -->
                </v-col>
              </v-row>
              <v-text-field
                v-if="question.questionType === 'text'"
                label="답변을 입력하세요"
              />
              <v-radio-group v-if="question.questionType==='radio'">
                <v-radio v-for="option in question.selection"
                  :key="option"
                  :label="option"
                  :value="option"/>
              </v-radio-group>

              <v-checkbox-group
                v-if="question.questionType==='checkbox'">
                <v-checkbox
                  v-for="option in question.selection"
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



<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useSurveyStore } from '@/stores/surveyStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const surveyStore = useSurveyStore();

const state = reactive({
  start: true,
  showTitleDescription: true,
  titleAndDescriptionCreated: false,
  readyToCreateQuestionTitle: true,
  formCreated: false,
  surveyId: null,
  questionId: null,
  selectionId: null,
  surveyTitle: null,
  surveyDescription: null,
  surveyQuestions: [],
  option: '',
  questionTitle: '',
  questionType: null,
  selection: [],
  isAdded: false,
  isEssential: false,
  generateOptions: ['text', 'radio', 'checkbox'],
  isFormDirty: false,
  randomString: '',
  uploadedImages: [],
  uploadedImage: null
});

const createForm = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 32; i++) {
    state.randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  state.surveyId = await surveyStore.requestCreateSurveyFormToDjango({ randomString: state.randomString });

  if (state.surveyId !== '') {
    state.formCreated = true;
    state.start = false;
  }
};

const sendTitleAndDescription = async () => {
  const payload = { surveyId: state.surveyId, surveyTitle: state.surveyTitle, surveyDescription: state.surveyDescription };
  const titleDescriptionSaved = await surveyStore.requestRegisterTitleAndDescriptionToDjango(payload);

  if (titleDescriptionSaved) {
    state.titleAndDescriptionCreated = true;
    state.showTitleDescription = false;
  }
};

const createQuestion = async (questionType) => {
  if (!state.questionTitle) {
    alert('내용을 입력하세요');
    return;
  }

  const imageFormData = new FormData();
  imageFormData.append('surveyId', state.surveyId);
  imageFormData.append('questionTitle', state.questionTitle);
  imageFormData.append('questionType', state.questionType);
  imageFormData.append('isEssential', state.isEssential ? 'true' : 'false');

  state.uploadedImages.forEach((image) => {
    imageFormData.append('images', image);
  });

  state.questionId = await surveyStore.requestCreateQuestionToDjango(imageFormData);
  state.readyToCreateQuestionTitle = false;

  if (state.questionId !== null && questionType === 'text') {
    const preForm = { questionTitle: state.questionTitle, questionType: questionType, isEssential: state.isEssential, images: state.uploadedImages };
    state.surveyQuestions.push(preForm);
    resetQuestionFields();
  }
};

const createSelection = async () => {
  if (state.option.trim() !== '') {
    state.selection.push(state.option);
    const payload = { questionId: state.questionId, selection: state.option };
    state.selectionId = await surveyStore.requestRegisterSelectionToDjango(payload);
    state.option = '';
    state.isFormDirty = true;
  } else {
    alert('항목에 내용을 입력하세요');
  }
};

const finishCreateSelection = () => {
  if (state.selection.length === 0) {
    alert('항목을 입력해주세요.');
    return;
  }
  if (state.questionId !== null && state.selectionId !== null) {
    const preForm = { questionTitle: state.questionTitle, questionType: state.questionType, isEssential: state.isEssential, selection: state.selection, images: state.uploadedImages };
    state.surveyQuestions.push(preForm);
    resetQuestionFields();
  }
};

const addQuestion = () => {
  state.isAdded = true;
  state.questionType = null;
  state.isFormDirty = true;
};

const onFileChange = (files) => {
  const newImages = Array.from(files);
  state.uploadedImages = [...state.uploadedImages, ...newImages];
  state.uploadedImage = null;
};

const resetQuestionFields = () => {
  state.questionTitle = '';
  state.selection = [];
  state.isAdded = false;
  state.questionType = null;
  state.isEssential = false;
  state.uploadedImages = [];
  state.isFormDirty = true;
  state.readyToCreateQuestionTitle = true;
};

const submitForm = () => {
  alert('제출 완료');
  router.push('/survey/created');
};

const formatQuestionTitle = (index, question) => {
  if (question.questionType === 'checkbox') {
    return `${index + 1}. ${question.questionTitle} (중복 선택 가능) <span class="essential">${question.isEssential ? '* 필수' : '* 선택'}</span>`;
  } else {
    return `${index + 1}. ${question.questionTitle} <span class="essential">${question.isEssential ? '* 필수' : '* 선택'}</span>`;
  }
};

const disableEnter = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const handleBeforeUnload = (event) => {
  if (state.isFormDirty) {
    const confirmationMessage = '작성 중인 정보가 저장되지 않을 수 있습니다.';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
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
  max-width: 600px;
  overflow-wrap: break-word;
  word-break: break-all;
}

.essential {
  font-size: 0.8em;
  color: rgb(255, 123, 0);
}

.li-margin {
  margin-left: 4%;
}
.tuning-hr {
  border: none;
  border-top: 1px solid #d1d1d1;
}
</style>
