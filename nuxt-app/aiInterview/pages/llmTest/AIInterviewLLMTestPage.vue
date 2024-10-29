<template>
  <main style="margin-top: 20vh;">
    <v-container v-if="!start"  align=center height="100%">
      <br><br><br>
      <h2>안녕하십니까? AI 모의 면접 서비스입니다.</h2><br>
      <v-container class="draw-line" align=start>
        <v-card-title align=center><strong>※ 사전 공지 ※</strong></v-card-title><br>
        <li class="li">본 면접은 특정 기업 및 직무에 맞추어진 면접이 아닌 <strong>인성 면접</strong>임을 알려드립니다.</li><br>
        <li class="li">총 <strong>5개</strong>의 질문이 제공됩니다.</li><br>
        <li class="li">현재 서비스에는 <strong>답변 시간 제한</strong>이 없으나 추후 추가될 예정입니다.</li><br>
      </v-container><br>
      <v-card-text><strong>면접 서비스를 시작하시려면 아래 버튼을 눌러주세요.</strong></v-card-text>
      <v-btn @click="startInterview" color="primary">START</v-btn>
      
    </v-container>
    <v-container v-if="start" align="center">
      <div v-if="visible" class="interview-container">
        <v-icon>mdi-account-tie</v-icon>
        <h2>{{ startMessage }}</h2>
      </div>
      <div v-if="!visible" class="interview-container">
        <v-icon>mdi-account-tie</v-icon>
        <h2>{{ currentAIMessage }}</h2>
      </div>

      <div v-if="isLoading" class="message ai">
        <v-icon>mdi:account-tie</v-icon>
        <div class="loading-message">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </v-container>

    <v-container v-if="start && !visible" class="input-area">
      <textarea
        v-model="userInput" 
        placeholder="메시지를 입력하세요..." 
        @keydown.enter.exact.prevent="handleEnterKey"  
        @keydown.shift.enter="handleShiftEnter"
        @input="adjustTextareaHeight"
        :disabled="finished || isLoading"
        ref="messageInput"
      ></textarea>
        <button class="send-button" @click="sendMessage" :disabled="finished || isLoading">입력</button>
    </v-container>
  </main>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useAiInterviewStore } from '@/stores/aiInterviewStore'; // Pinia store import
import { useAccountStore } from '../../../account/stores/accountStore';
import markdownIt from 'markdown-it';
import { useRouter } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css';

// Pinia Stores
const aiInterviewStore = useAiInterviewStore();
const accountStore = useAccountStore();
const router = useRouter();

// Component State
const accountId = ref('');
const start = ref(false);
const finished = ref(false);
const visible = ref(true);
const userInput = ref('');
const aiOutput = ref('');
const startMessage = '안녕하세요. AI 모의 면접 서비스입니다. 제한 시간 내에 답변 작성 부탁드립니다. 지금부터 면접을 시작하겠습니다.';
const currentAIMessage = ref('');
const chatHistory = ref([{ type: 'ai', content: '' }]);
const isLoading = ref(false);
const sendCount = ref(0);
const maxMessages = 5;
const aiResponseList = ref([]);
const questionIndex = ref(0);
const intentList = ['대처 능력', '적응력', '프로젝트 경험', '자기 개발'];
const intentIndex = ref(-1);

// Computed Properties
const isCheckoutDisabled = computed(() => sendCount.value >= maxMessages);

// Watchers
watch(start, (newVal) => {
  if (newVal === true) {
    showStartMessage();
  }
});

watch(visible, (newVal) => {
  if (newVal === false) {
    getAIQuestions();
  }
});

// Lifecycle Hooks
onMounted(async () => {
  const email = sessionStorage.getItem("email");
  if (email) {
    accountId.value = await accountStore.requestAccountIdToDjango(email);
  } else {
    alert('로그인이 필요합니다.');
    router.push('/account/login');
  }
});

// Methods
const startInterview = () => {
  start.value = true;
};

const getAIQuestions = async () => {
  if (aiResponseList.value.length === 0) {
    const sessionId = Math.floor(Math.random() * 200) + 1;
    aiResponseList.value = await aiInterviewStore.requestGetQuestionListToDjango({ sessionId: sessionId });
  }
  currentAIMessage.value = aiResponseList.value.questionList[questionIndex.value] || '질문을 불러오는 데 실패하였습니다. 다시 시도해주세요.';
  intentIndex.value++;
  chatHistory.value.push({ type: "ai", content: currentAIMessage.value });

  const chunks = chunkText(currentAIMessage.value, 1);
  streamText(chunks);
};

const renderMessageContent = (message) => {
  if (message.type !== 'user') {
    return `<h2>${markdownIt().render(message.content)}</h2>`;
  }
};

const chunkText = (text, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
};

const streamText = async (chunks) => {
  currentAIMessage.value = '';
  let index = 0;
  const interval = setInterval(() => {
    if (index < chunks.length) {
      currentAIMessage.value += chunks[index];
      updateAIMessage();
      index++;
    } else {
      clearInterval(interval);
    }
  }, 10);
};

const updateAIMessage = () => {
  const lastIndex = chatHistory.value.length - 1;
  if (chatHistory.value[lastIndex] && chatHistory.value[lastIndex].type === 'ai') {
    chatHistory.value[lastIndex].content = currentAIMessage.value;
  } else {
    chatHistory.value.push({ type: 'ai', content: currentAIMessage.value });
  }
};

const adjustTextareaHeight = () => {
  const textarea = document.getElementById("messageInput");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

const handleEnterKey = (event) => {
  if (!event.shiftKey) {
    sendMessage();
  }
};

const handleShiftEnter = () => {
  adjustTextareaHeight();
};

const sendMessage = async () => {
  if (sendCount.value >= maxMessages) {
    finished.value = true;
    return;
  }
  if (userInput.value.trim()) {
    chatHistory.value.push({ type: 'user', content: userInput.value });
    userInput.value = '';
    adjustTextareaHeight();
    isLoading.value = true;
    sendCount.value++;

    setTimeout(async () => {
      if (aiResponseList.value.length === 0) {
        const sessionId = Math.floor(Math.random() * 200) + 1;
        aiResponseList.value = await aiInterviewStore.requestGetQuestionListToDjango({ sessionId: sessionId });
      }

      if (intentIndex.value === 4) {
        currentAIMessage.value = "수고하셨습니다. 면접이 종료되었습니다. 추후에 더 발전된 서비스로 찾아뵙겠습니다.";
        chatHistory.value.push({ type: "ai", content: currentAIMessage.value });
        finished.value = true;
        if (finished.value) {
          chatHistory.value.shift();
          chatHistory.value.pop();
          const contents = chatHistory.value.map(item => item.content);
          const pairedContents = [];
          const interviewIntents = ['자기 분석', '대처 능력', '소통 능력', '프로젝트 경험', '자기 개발'];

          for (let i = 0; i < contents.length; i += 2) {
            pairedContents.push([contents[i], contents[i + 1], interviewIntents[Math.floor(i / 2)]]);
          }

          console.log('result: ', pairedContents);
          const payload = { 'interviewResult': pairedContents };
          await aiInterviewStore.requestInferScoreResultToFastAPI(payload);
          const response = await aiInterviewStore.requestInferedResultToFastAPI(); //[1,2,3,4,5]
          console.log('response: ', response);
          for (let i = 0; i < response.length; i++) {
            pairedContents[i].push(response[i]);
          }
          console.log('pairedContents', pairedContents);
          const result = { scoreResultList: pairedContents, accountId: accountId.value };
          const saveDone = await aiInterviewStore.requestSaveInterviewResultToDjango(result);
          if (saveDone) {
            alert('면접 결과 확인하기');
            router.push(`/ai-interview/result/${accountId.value}`);
          }
        }
      } else {
        const nextIntent = intentList[intentIndex.value];
        intentIndex.value++;

        let lastUserInput = null;
        for (let i = chatHistory.value.length - 1; i >= 0; i--) {
          if (chatHistory.value[i].type === 'user') {
            lastUserInput = chatHistory.value[i].content;
            break;
          }
        }

        const payload = { answer: lastUserInput, nextIntent: nextIntent };
        await aiInterviewStore.requestInferNextQuestionToFastAPI(payload);

        const response = await aiInterviewStore.requestInferedResultToFastAPI();
        if (response && response.nextQuestion) {
          currentAIMessage.value = response.nextQuestion;
        }

        chatHistory.value.push({ type: "ai", content: currentAIMessage.value });
      }

      const chunks = chunkText(currentAIMessage.value, 1);
      streamText(chunks);
      isLoading.value = false;
    }, 1000);
  }
};

const showStartMessage = () => {
  setTimeout(() => {
    visible.value = false;
  }, 2500);
};
</script>

<style scoped>
.draw-line {
  border: 1px solid #333; 
  padding: 16px;
  border-radius: 10px;
  width: 57%;
}

.li {
  margin-left: 3%;
}

.interview-container {
  margin-top: 20%;
  border: 1px solid #333; 
  padding: 16px;
  border-radius: 10px;
  width: 70%;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 50%;
  margin-bottom: 0;
}

textarea {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 12px;
  resize: none; 
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 15px;
  background-color: rgba(255, 255, 255, 1);
  color: black;  
  height: 50px;
  max-height: 70px;
}

.send-button {
  padding: 10px 12px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer; 
  font-size: 16px;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: rgba(233, 233, 235, 0.8);
  color: black;
  font-style: italic;
  width: 50px;
}

.loading-message .dot {
  height: 10px;
  width: 10px;
  margin: 0 2px;
  background-color: black;
  border-radius: 50%;
  display: inline-block;
  opacity: 0;
  animation: loading-animation 1.5s infinite ease-in-out;
}

.loading-message .dot:nth-child(1) {
  animation-delay: 0s;
}

.loading-message .dot:nth-child(2) {
  animation-delay: 0.3s;
}

.loading-message .dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes loading-animation {
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>