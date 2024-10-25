<template>
    <v-app-bar color="transparent" app dark height="72" class="menu-bar">
    
      <v-btn text @click="goToHome" class="navbar-logo-btn">
        <v-img
          class="home-icon"
          src="@/assets/images/fixed/AIM_BI_White.png"
          alt="AIM LOGO"
          contain
          height="56"
          width="56"
          cover
        />
      </v-btn>
  
      <v-spacer></v-spacer>
  
      <v-btn text @click="goToHome" class="btn-text">
        HOME
      </v-btn>
  
      <v-btn
        v-if="isAdmin"
        text
        @click="goToSurveyListPage"
        class="btn-text"
      >
        SURVEY
      </v-btn>
      <v-btn
        v-else
        text
        @click="goToSurvey"
        class="btn-text"
      >
        SURVEY
      </v-btn>
  
      <v-btn text @click="goToProductList" class="btn-text">
        COMPANY REPORT
      </v-btn>
      
      <!-- AI Interview 메뉴 -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
            <b>AI Interview</b>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in aiInterviewPageList"
            :key="index"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  
      <v-spacer></v-spacer>
  
      <v-menu v-if="isAuthenticated" close-on-content-click>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
            <b>My Page</b>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in myPageItems"
            :key="index"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  
      <v-menu v-if="isAdmin" close-on-content-click>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
            <b>ADMIN</b>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in adminPageList"
            :key="index"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
  
      <v-btn
        v-if="!isAuthenticated"
        text
        @click="signIn"
        class="btn-login"
      >
        LOGIN
      </v-btn>
      <v-btn
        v-else
        text
        @click="signOut"
        class="btn-logout"
      >
        LOGOUT
      </v-btn>
    </v-app-bar>
</template>
  
<script setup>
import { useRouter } from 'vue-router';
// import { useAuthStore } from '@/stores/auth';
// import { useSurveyStore } from '@/stores/survey';

const router = useRouter();
// const authStore = useAuthStore();
// const surveyStore = useSurveyStore();

// const isAuthenticated = authStore.isAuthenticated;
// const isAdmin = authStore.isAdmin;

// Admin 페이지 이동 리스트
// const adminPageList = [
// { title: '사용자 관리', action: () => router.push('/management/user') },
// { title: '사용자 로그 현황', action: () => router.push('/management/log') },
// ];

// My Page 리스트
const myPageItems = [
{ title: '회원 정보', action: () => router.push('/account/mypage') },
{ title: '장바구니', action: () => router.push('/cart/list') },
{ title: '주문 목록', action: () => router.push('/order/list') },
];

// AI Interview 페이지 리스트
const aiInterviewPageList = [
  { title: '대화형', action: () => router.push('/ai-interview') },
  { title: '단일 질문 노출형', action: () => router.push('/ai-interview/llmTest') },
];

// 네비게이션 관련 메서드
const goToHome = () => router.push('/');
const goToProductList = () => router.push('/companyReport/list');
const goToSurveyListPage = () => router.push('/survey/list');

const signIn = () => router.push('/account/login');
const signOut = () => {
// authStore.signOut();
router.push('/');
};

// const goToSurvey = async () => {
// const randomString = await surveyStore.getRandomString();
// if (randomString) {
//     router.push({ name: 'SurveyReadPage', params: { randomString } });
// }
// };
</script>





<style scoped>
.menu-bar {
  background: var(--Gradient-Liner-1, linear-gradient(94deg, #0A28B0 1.69%, #8094F4 116.61%)) !important;
}
/* AIM 로고 이미지 버튼 */
.navbar-logo-btn {
  display: flex;
  align-items: center;
  margin-left: 80px !important;
}

.btn-text {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: #FFF;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 0px 10px;
  margin: 0px 10px;
}

.btn-login {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 700px;
  color: #FFF;
  letter-spacing: 0.5px;
  text-transform: uppercase;  
  margin-right: 80px !important;
  border: 1px solid white;
  color: white; /* 텍스트 색상도 흰색으로 변경 */  
}

.btn-logout {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 700px;
  color: #FFF;
  letter-spacing: 0.5px;
  text-transform: uppercase;  
  margin-right: 80px !important;
  border: 1px solid white;
  color: white; /* 텍스트 색상도 흰색으로 변경 */  
}


.btn-text:hover {
  background-color: rgba(255, 255, 255, 0.25);
  
}
/* 클릭해서 선택되었을시 표시 */
.btn-text:focus {
  background-color: rgba(255, 255, 255, 0.25); 
  color: white;
  
}

.v-menu > .v-overlay__content > .v-card,
.v-menu > .v-overlay__content > .v-sheet,
.v-menu > .v-overlay__content > .v-list {  
  background-color: rgba(0, 0, 0, 0.25);
  color: white;
  border: 3px solid white
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.25);
  
}
</style>
