<template>
  <div class="home-container">
    <div class="nav-container">
      <!-- 네비게이션 바 내용 -->
    </div>

    <div class="content-wrapper">
      <h2 class="prompt-title">AI 모의 면접</h2>
      <div class="prompt-container">
        <div class="chat-window">
          <div
            v-for="(message, index) in chatHistory"
            :key="index"
            :class="['message', message.type]"
          >
            <div v-if="message.type === 'user'" class="avatar user-avatar"></div>
            <div v-else class="avatar ai-avatar">
              <v-icon>mdi-account-tie</v-icon>
            </div>
            <div class="message-content" v-html="renderMessageContent(message)"></div>
          </div>

          <div v-if="isLoading" class="message ai">
            <v-icon>mdi:account-tie</v-icon>
            <div class="loading-message">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>

        <!-- 입력창을 항상 맨 아래에 위치시키기 -->
        <div class="input-area">
          <textarea
            v-model="userInput" 
            placeholder="메시지를 입력하세요..." 
            @keydown.enter.exact.prevent="handleEnterKey"  
            @keydown.shift.enter="handleShiftEnter"
            @input="adjustTextareaHeight"
            ref="messageInput"
          ></textarea>
          <button class="send-button" @click="sendMessage">입력</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import router from "@/router";
import { mapActions, mapState } from "vuex";
import markdownIt from 'markdown-it'
import '@mdi/font/css/materialdesignicons.css'

export default ({
  data() {
    return {
      userInput: '',
      userInputMessage: '',
      aiOutput: '',
      chatHistory: [
        { type: 'ai', content: '안녕하세요! AI 모의 면접 서비스입니다.' }
      ],
      isLoading: false,  // 로딩 상태 추가,
      md: new markdownIt(), // markdown-it

      showContextMenu: false,
      contextMenuX: 0,
      contextMenuY: 0,
      selectedContent: '',
      showModal: false,
      userAvatar: "https://via.placeholder.com/40x40?text=U",
      aiAvatar: "https://via.placeholder.com/40x40?text=AI",
      currentAIMessage: '',  // 현재 AI 메시지를 저장하는 변수
    };
  },
  methods: {
    renderMessageContent(message) {
      if (message.type !== 'user') {
        // markdown-it로 렌더링된 내용에 .markdown-content 클래스를 추가
        return `<div class="markdown-content">${this.md.render(message.content)}</div>`;
      } else {
        return message.content
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
      this.currentAIMessage = '';  // 초기화
      let index = 0;
      const interval = setInterval(() => {
        if (index < chunks.length) {
          this.currentAIMessage += chunks[index];
          this.updateAIMessage();  // AI 메시지 업데이트 메소드 호출
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10); // 10ms마다 조각 추가
    },

    updateAIMessage() {
      // chatHistory를 갱신하여 화면에 업데이트
      const lastIndex = this.chatHistory.length - 1;
      if (this.chatHistory[lastIndex] && this.chatHistory[lastIndex].type === 'ai') {
        this.chatHistory[lastIndex].content = this.currentAIMessage;
      } else {
        this.chatHistory.push({ type: 'ai', content: this.currentAIMessage });
      }
    },

    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = "auto";  // 높이를 자동으로 설정
      textarea.style.height = `${textarea.scrollHeight}px`;  // 내용에 따라 높이 설정
    },

    handleEnterKey(event) {
      if (!event.shiftKey) {
        // Shift 키가 눌리지 않은 경우에만 메시지 전송
        this.sendMessage();
      }
    },

    handleShiftEnter(event) {
      // 기본 줄바꿈 동작을 유지함으로써 커서가 줄바꿈되도록 함
      this.adjustTextareaHeight();  // 줄바꿈 후 높이 조정
    },

    sendMessage(event) {
      if (this.userInput.trim()) {
        // 텍스트 메시지를 채팅 히스토리에 추가
        if (this.userInput.trim()) {
          this.chatHistory.push({ type: 'user', content: this.userInput });
          this.userInputMessage = this.userInput;
        }

        this.userInput = '';
        this.adjustTextareaHeight();  // 전송 후 높이도 초기화
        this.isLoading = true;  // ... 로딩 상태 활성화

        // AI 응답 시뮬레이션
        setTimeout(() => {
          const aiResponse = "AI 모의 면접 서비스를 위해 데이터를 구축 중입니다. 조금만 기다려 주세요!"
          this.chatHistory.push({
            type: "ai",
            content: aiResponse,
          });
          const chunks = this.chunkText(aiResponse, 1)
          this.streamText(chunks)
          this.isLoading = false
        }, 1000)
      }
    },
  }
});
</script>

<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}

.prompt-title {
  text-align: center; /* 제목을 가운데 정렬 */
  font-size: 28px; /* 제목의 글자 크기 */
  margin-bottom: 20px; /* 제목과 프롬프트 컨테이너 사이의 여백 */
  color: #333; /* 제목 색상 설정 */
}

/* 채팅 프롬프트 컨테이너 */
.prompt-container {
  width: 60%;
  max-width: 1980px;
  margin: 30px auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;  /* 입력창이 맨 아래로 고정되도록 설정 */
  min-height: 60vh;
  max-height: 90vh;
  overflow-y: auto;
  background-color: white; /* 배경을 흰색으로 설정 */
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2); /* 부드러운 그림자 추가 */
}

/* 채팅 창 */
.chat-window {
  flex-grow: 1;  /* 대화 내용이 영역을 채우도록 설정 */
  padding: 20px;
  overflow-y: auto;  /* 대화 내용이 많아지면 스크롤바 추가 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 대화가 위에서부터 쌓이도록 설정 */
  background-color: transparent; /* 배경을 투명으로 유지 */
}

/* 각 메시지의 스타일 */
.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  max-width: 55%;
}

.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.ai {
  margin-right: auto;
}

:root {
  --user-avatar-color: #4CAF50; /* 사용자 아바타 색상 */
  --ai-avatar-color: #2196F3; /* AI 아바타 색상 */
}

/* 아바타 이미지 스타일 */
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 0 10px;
  border: 2px solid transparent; /* 기본적으로 투명한 테두리 설정 */

}

.ai .avatar {
  font-size: 30px; /* 아이콘 크기 조정 */
  color: black; /* 아이콘 색상 조정 */
  margin: 15px 20px;
  margin-top: 25px;   /* 위쪽 여백 */
  margin-bottom: 5px; /* 아래쪽 여백 */
  margin-left: 10px;  /* 왼쪽 여백 */
  margin-right: 10px; /* 오른쪽 여백 */
}

.user .avatar {
  font-size: 30px; /* 아이콘 크기 조정 */
  color: black; /* 아이콘 색상 조정 */
  margin: 15px 50px;
  margin-top: 25px;   /* 위쪽 여백 */
  margin-bottom: 10px; /* 아래쪽 여백 */
  margin-left: 20px;  /* 왼쪽 여백 */
  margin-right: 5px; /* 오른쪽 여백 */
}


/* 메시지 내용 스타일 */
.message-content {
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 50%;  /* 말풍선의 최대 가로 너비를 50%로 제한 */
  background-color: rgba(0, 0, 0, 0.1); /* 밝은 배경색 */
}

.user .message-content {
  background-color: #dde7f0; /* 사용자 말풍선 색상 변경 */
  color: black;
  border-radius: 20px 20px 0px 20px;
  max-width: 100%;  /* 사용자 말풍선도 50%로 제한 */
}

.ai .message-content {
  background-color: #dde7f0; /* AI 말풍선 색상 변경 */
  color: black;
  border-radius: 20px 20px 20px 0px;
  max-width: 100%;  /* AI 말풍선도 50%로 제한 */
}

/* 메시지 입력 영역 스타일 */
.input-area {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 10px;
  gap: 10px; /* 버튼과 입력창 사이의 간격 */
  height: auto;
  max-height: 80px; /* 입력 영역의 최대 높이 설정 */
  margin-bottom: 0; /* 아래 여백을 제거 */
}

textarea {
  flex-grow: 1; /* 공간을 최대한 차지하도록 설정 */
  border: 1px solid #ccc; /* 밝은 색으로 테두리 추가 */
  padding: 10px; /* 안쪽 여백 추가 */
  resize: none; /* 크기 조정 비활성화 */
  border-radius: 10px;
  box-sizing: border-box;
  font-size: 15px;
  background-color: rgba(255, 255, 255, 1); /* 흰색 배경 */
  color: black;  
  height: auto; /* 높이 자동 조정 */
  max-height: 100px; /* 최대 높이 제한 */
  margin-right: 8px; /* 버튼과의 간격을 위해 오른쪽 여백 추가 */
}

.send-button {
  padding: 10px 12px; /* 버튼 내부 여백 */
  background-color: #474c52; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  border: none;
  border-radius: 20px; /* 둥근 모서리 */
  cursor: pointer; /* 커서 포인터로 변경 */
  font-size: 16px; /* 버튼 텍스트 크기 */
}

/* 전송 버튼 스타일 */
button {
  background-color: #474c52; /* 버튼 배경을 파란색으로 변경 */
  color: white; /* 버튼 텍스트 색상 변경 */
  border: none;
  padding: 10px;
  margin: 0; /* 버튼들 사이의 불필요한 여백 제거 */
  cursor: pointer;
  border-radius: 20px;
  font-size: 16px;
}

button + button {
  margin-left: 10px; /* 파일 선택 버튼과 전송 버튼 사이의 간격 */
}

/* ... 로딩 말풍선 */
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

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.context-menu li {
  padding: 10px;
  cursor: pointer;
}
.context-menu li:hover {
  background-color: #f0f0f0;
}

</style>
