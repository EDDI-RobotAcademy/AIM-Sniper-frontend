<template>
  <main>
    <v-container v-if="!start"  align=center height="100%">
      <br><br><br>
      <h2>안녕하십니까? AI 모의 면접 서비스입니다.</h2><br>
      <v-container class="draw-line">
        <v-card-title>안내 사항</v-card-title>
        <v-card-text>- 본 면접은 ~~를 위해 사용하실 수 있습니다.</v-card-text>
        <v-card-text>- 총 6번의 질문이 제공됩니다.</v-card-text>
      </v-container>
      <v-card-text>면접 서비스를 시작하시려면 아래 버튼을 눌러주세요.</v-card-text>
      <v-btn @click="startInterview">START</v-btn>
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

<script>
import { mapActions } from 'vuex'
import markdownIt from 'markdown-it'
import '@mdi/font/css/materialdesignicons.css'
const aiInterviewModule = 'aiInterviewModule'

export default ({
  data() {
    return {
      start: false,
      finished: false,
      visible: true,
      userInput: '',
      aiOutput: '',
      startMessage : '안녕하세요. AI 모의 면접 서비스입니다. 제한 시간 내에 답변 작성 부탁드립니다. 지금부터 면접을 시작하겠습니다.',
      currentAIMessage: '',
      chatHistory: [
        { type: 'ai', content: ''}
      ],
      isLoading: false,
      sendCount: 0,
      maxMessages: 5,
      aiResponseList: [],
      questionIndex: 0,  
    };
  },
  watch: {
    start(newVal) {
      if (newVal === true) {
        this.showStartMessage()
      }
    },  
    visible(newVal) {
      if (newVal === false) {
        this.getAIQuestions();
      }
    }
  },
  methods: {
    ...mapActions(aiInterviewModule, ['requestGetQuestionListToDjango' ]),
    startInterview() {
      this.start = true;
    },
    async getAIQuestions() { 
      console.log('getAIQuestions()')   
      if (this.aiResponseList.length === 0) {
        const sessionId = Math.floor(Math.random() * 200) + 1;
        this.aiResponseList = await this.requestGetQuestionListToDjango({ sessionId: sessionId });
      }

      this.currentAIMessage = this.aiResponseList.questionList[this.questionIndex] || '질문을 불러오는 데 실패하였습니다. 다시 시도해주세요.';
      this.questionIndex++;

      this.chatHistory.push({
        type: "ai",
        content: this.currentAIMessage,
      });

      const chunks = this.chunkText(this.currentAIMessage, 1);
      this.streamText(chunks);
    },
    renderMessageContent(message) {
      if (message.type !== 'user') {
        return `<h2>${this.md.render(message.content)}</h2>`;
      }
    },
    chunkText(text, chunkSize) {
      const chunks = [];
      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
      }
      return chunks;
    },
    
    async streamText(chunks) {
      this.currentAIMessage = '';
      let index = 0;
      const interval = setInterval(() => {
        if (index < chunks.length) {
          this.currentAIMessage += chunks[index];
          this.updateAIMessage();
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10);
    },

    updateAIMessage() {
      const lastIndex = this.chatHistory.length - 1;
      if (this.chatHistory[lastIndex] && this.chatHistory[lastIndex].type === 'ai') {
        this.chatHistory[lastIndex].content = this.currentAIMessage;
      } else {
        this.chatHistory.push({ type: 'ai', content: this.currentAIMessage });
        console.log('chathistroy에 AI 질문 추가: ', this.chatHistory)
      }
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`; 
    },

    handleEnterKey(event) {
      if (!event.shiftKey) {
        this.sendMessage();
      }
    },
    handleShiftEnter(event) {
      this.adjustTextareaHeight();
    },
    async sendMessage(event) {
      if (this.sendCount >= this.maxMessages) {
        this.finished = true;
        return; 
      }
      if (this.userInput.trim()) {
        this.chatHistory.push({ type: 'user', content: this.userInput });
        console.log('chathistroy에 User 답변 추가: ', this.chatHistory);
        this.userInput = '';
        this.adjustTextareaHeight();
        this.isLoading = true; 
        this.sendCount++;

        setTimeout(async () => {
          if (this.aiResponseList.length === 0) {
            console.log('나오면 안됨')
            const sessionId = Math.floor(Math.random() * 200) + 1;
            this.aiResponseList = await this.requestGetQuestionListToDjango({ sessionId: sessionId });
          }
          this.currentAIMessage = this.aiResponseList.questionList[this.questionIndex] || 
            "수고하셨습니다. 면접이 종료되었습니다. 추후에 더 발전된 서비스로 찾아뵙겠습니다.";
          this.questionIndex++;

          this.chatHistory.push({
            type: "ai",
            content: this.currentAIMessage,
          });

          const chunks = this.chunkText(this.currentAIMessage, 1);
          this.streamText(chunks);
          this.isLoading = false;
        }, 1000);
      }
    },
    showStartMessage() {
      setTimeout(() => {
        this.visible = false;
      }, 2500);
    },
  },
});
</script>

<style scoped>
.draw-line {
  border: 1px solid #333; 
  padding: 16px;
  border-radius: 10px;
  width: 40%;
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
