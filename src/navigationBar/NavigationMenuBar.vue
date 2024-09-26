<template>
  <v-app-bar color="rgba(82,82,82,0.3)" app dark height="64" style="backdrop-filter: blur(10px) saturate(180%); /* 블러와 채도를 높여 유리 효과 추가 */
  -webkit-backdrop-filter: blur(10px) saturate(180%); /* 사파리 호환성 */
  border-top: 1px solid rgba(255, 255, 255, 0.3); /* 유리 느낌을 주기 위한 테두리 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 추가 */"> 
    <v-toolbar-title class="navbar-title" style="display: flex; align-items: center;">
      <v-btn text @click="goToHome" class="navbar-title-btn" style="display: flex; align-items: center;">
        <v-img
          class="home-icon"
          src="@/assets/images/fixed/AiM_BI_Basic.png"
          alt="AIM LOGO"
          contain
          height="83" 
          width="64" 
          cover
        ></v-img>
        <p style="font-size: 16px; font-weight: bold;">&nbsp; AI company Insight Market</p> <!-- 텍스트도 중앙 정렬 -->
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn v-if="isAdmin" text @click="goToSurveyListPage" class="btn-text">
      <span>survey</span>
    </v-btn>

    <v-btn text @click="goToCompanyReportList" class="btn-text">
      <span>companyReport</span>
    </v-btn>

    <v-menu
      v-if="
        isAuthenticatedKakao ||
        isAuthenticatedGoogle ||
        isAuthenticatedNormal ||
        isAuthenticatedNaver
      "
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="btn-text" @click="goToCart">
          <b>cart</b>
        </v-btn>
      </template>
    </v-menu>

    <v-menu
      v-if="
        isAuthenticatedKakao ||
        isAuthenticatedGoogle ||
        isAuthenticatedNormal ||
        isAuthenticatedNaver
      "
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="btn-text" @click="goToOrder">
          <b>order</b>
        </v-btn>
      </template>
    </v-menu>

    <v-menu
      v-if="
        isAuthenticatedKakao ||
        isAuthenticatedGoogle ||
        isAuthenticatedNormal ||
        isAuthenticatedNaver
      "
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="btn-text" style="margin-right: 16px">
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

    <v-btn
      v-if="
        !isAuthenticatedKakao &&
        !isAuthenticatedGoogle &&
        !isAuthenticatedNormal &&
        !isAuthenticatedNaver &&
        !isAdmin
      "
      text
      @click="signIn"
      class="btn-text"
    >
      <v-icon left>mdi-login</v-icon>
      <span> &nbsp; LOGIN</span>
    </v-btn>
    <v-btn v-else text @click="signOut" class="btn-text">
      <v-icon left>mdi-logout</v-icon>
      <span> &nbsp; LOGOUT</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import "@mdi/font/css/materialdesignicons.css";
import router from "@/router";
import { mapActions, mapState } from "vuex";

const accountModule = "accountModule";
const authenticationModule = "authenticationModule";
const googleAuthenticationModule = "googleAuthenticationModule";
const naverAuthenticationModule = "naverAuthenticationModule";

export default {
  data() {
    return {
      myDocumentItems: [
        {
          title: "AI 논문 자료 정리",
          action: () => {
            this.goToDocumentList();
          },
        },
        // {
        //   title: "내가 저장한 논문 요약",
        //   action: () => {
        //     this.goToDocumentSummaryList();
        //   },
        // },
      ],
      myPageItems: [
        {
          title: "회원 정보",
          action: () => {
            this.goToMyPage();
          },
        },
      ],
      isUserAuthenticated: sessionStorage.getItem("isUserAuthenticated"),
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticatedKakao", "isAdmin"]),
    ...mapState(googleAuthenticationModule, ["isAuthenticatedGoogle"]),
    ...mapState(accountModule, ["loginType", "isAuthenticatedNormal"]),
    ...mapState(naverAuthenticationModule, ["isAuthenticatedNaver"]),
  },
  methods: {
    ...mapActions(authenticationModule, ["requestKakaoLogoutToDjango"]),
    ...mapActions(googleAuthenticationModule, ["requestGoogleLogoutToDjango"]),
    ...mapActions(naverAuthenticationModule, ["requestNaverLogoutToDjango"]),
    goToHome() {
      router.push("/");
    },
    goToCompanyReportList() {
      router.push("/companyReport/list");
    },

    goToCart() {
      router.push("/cart/list");
    },
    goToOrder() {
      router.push("/order/list");
    },

    goToMyPage() {
      router.push("/account/mypage");
    },
    goToSurveyListPage() {
      router.push("/survey/list");
    },
    signIn() {
      router.push("/account/login");
    },
    signOut() {
      if (sessionStorage.getItem("loginType") == "KAKAO") {
        this.requestKakaoLogoutToDjango();
        this.$store.state.authenticationModule.isAuthenticatedKakao = false;
        this.$store.state.authenticationModule.isAdmin = false;
      }
      if (sessionStorage.getItem("loginType") == "GOOGLE") {
        this.requestGoogleLogoutToDjango();
        this.$store.state.googleAuthenticationModule.isAuthenticatedGoogle = false;
      }
      if (sessionStorage.getItem("loginType") == "NAVER") {
        this.requestNaverLogoutToDjango();
        this.$store.state.naverAuthenticationModule.isAuthenticatedNaver = false;
      }
      if (sessionStorage.getItem("loginType") == "NORMAL") {
        sessionStorage.removeItem("normalToken");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("loginType");
        if (sessionStorage.getItem("fileKey")) {
          sessionStorage.removeItem("fileKey");
        }
        this.$store.state.accountModule.isAuthenticatedNormal = false;
      }
      router.push("/");
    },
  },

  mounted() {
    // console.log("navigation bar mounted()");
    const userToken = sessionStorage.getItem("userToken");
    if (userToken) {
      // console.log("You already has a userToken!");
      this.$store.state.authenticationModule.isAuthenticatedKakao = true;
    }
    const googleUserToken = sessionStorage.getItem("googleUserToken");
    if (googleUserToken) {
      // console.log("You already has a googleUserToken!")
      this.$store.state.googleAuthenticationModule.isAuthenticatedGoogle = true;
    }
    const naverUserToken = sessionStorage.getItem("naverUserToken");
    if (naverUserToken) {
      // console.log("You already has a naverUserToken!")
      this.$store.state.naverAuthenticationModule.isAuthenticatedNaver = true;
    }
    const normalToken = sessionStorage.getItem("normalToken");
    if (normalToken) {
      this.$store.state.accountModule.isAuthenticatedNormal = true;
    }
  },
};
</script>

<style scoped>

.navbar-title {
  font: 0.75em Verdana, Dotum, AppleGothic, sans-serif;
  font-family: 'Knockout-51', "Ubuntu", "Noto Sans KR", "Nanum Gothic", Verdana, Dotum, AppleGothic, sans-serif;
  letter-spacing: 0.3px;
  font-size: 24px;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center; /* 수직 정렬 */
}

.navbar-title-btn {
  font: 0.75em Verdana, Dotum, AppleGothic, sans-serif;
  font-family: 'Knockout-51', "Ubuntu", "Noto Sans KR", "Nanum Gothic", Verdana, Dotum, AppleGothic, sans-serif;
  letter-spacing: 0.3px;
  color: black;
  display: flex;
  align-items: center; /* 로고와 텍스트 수직 정렬 */
}

.btn-text {
  font: 0.75em Verdana, Dotum, AppleGothic, sans-serif;
  font-family: 'Knockout-51', "Ubuntu", "Noto Sans KR", "Nanum Gothic", Verdana, Dotum, AppleGothic, sans-serif;
  letter-spacing: 0.3px;
  font-size: 16px;
  margin-right: 16px;
  color: black;
}

.v-btn:hover {
  background-color: rgba(0, 255, 55, 0.25);
}

.v-btn:hover .btn-text {
  color: white;
}

.v-btn:focus {
  background-color: rgba(0, 255, 55, 0.25); /* 클릭해서 선택되었을시 표시 */
  color: white;
}

.v-btn:focus .btn-text {
  color: white;
}

.v-menu > .v-overlay__content > .v-card,
.v-menu > .v-overlay__content > .v-sheet,
.v-menu > .v-overlay__content > .v-list {
  background-color: rgba(2, 74, 27, 0.479);
  color: rgb(0, 255, 0);
  border: 2px solid rgb(0, 255, 0);
}

.v-list-item:hover {
  background-color: rgba(0, 255, 55, 0.25);
}
</style>
