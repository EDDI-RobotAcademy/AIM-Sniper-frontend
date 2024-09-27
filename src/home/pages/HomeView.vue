<template>
  <div class="home-container">
    <img :src="imageSrc" alt="Home Image" class="home-image" />

    <div class="text-container">
      <h2 class="title">
        <p style="font-size: 30px; font-weight: bold; text-transform: none;">
          &nbsp; <span style="color: blue; font-weight: bold;">A</span>i company-report&nbsp;
          <span style="color: blue; font-weight: bold;">I</span>nsight&nbsp;
          <span style="color: blue; font-weight: bold;">M</span>arket
        </p>
      </h2>
      <div style="margin-bottom: 10px"></div>
      <p class="subtitle">SINCE 2024</p>
      <div style="margin-bottom: 20px"></div>
      <p class="description">
        AIM은 한국 IT 기업 분석 보고서와 AI 모의면접 서비스를 제공하여 <br />
        보다 많은 사람들에게 양질의 정보를 공유하고 도움을 드릴 수 있도록 최선을 다하겠습니다.
      </p>
      <div class="buttons">
        <button class="goToProduct-button" @click="goToProductList">
          <b>기업 분석 보고서</b> 구경하기
        </button>
        <button class="goToSurvey-button" @click="goToSurveyList">
          <b>설문조사</b> 해주세요
        </button>
      </div>
    </div>

    <div class="footer-container">
      <p class="reserved-info">2024-2025 AIM-Sniper Korea LLC. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import imageSrc from "@/assets/images/homeImages/home_bg.png";
import router from "@/router";
import { mapActions, mapState } from "vuex";

const authenticationModule = "authenticationModule";
const surveyModule = "surveyModule"

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      imageSrc,
      surveyId:1,
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  methods: {
    ...mapActions(authenticationModule, ["requestLogoutToDjango"]),
    ...mapActions(surveyModule,['requestRandomStringToDjango']),
    goToCompanyReportList() {
      router.push("/companyReport/list");
    },
    goToCommunityList() {
      router.push("/community/list");
    },
    goToReviewList() {
      router.push("/review/list");
    },
    goToProductList(){
      router.push("/CompanyReport/list")
    },
    async goToSurveyList() {
      try {
        // requestRandomStringToDjango에서 randomString 요청
        const randomString = await this.requestRandomStringToDjango(this.surveyId);
        
        // randomString이 존재하면 SurveyReadPage로 이동
        if (randomString) {
          this.$router.push({
            name: 'SurveyReadPage',
            params: { randomString: randomString.toString() }
          });
        } else {
          // randomString이 없으면 alert
          alert("질문지가 아직 등록되지 않았습니다.");
        }
      } catch (error) {
        // 에러 발생 시 메시지 처리
        console.error("질문지 정보를 불러오는 중 에러가 발생했습니다:", error);
        alert("질문지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  },
});
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%; /* 전체 너비 설정 */
  overflow: hidden; /* 전체 페이지의 오버플로우 비활성화 */
}

.home-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: auto;
}

.home-image {
  margin-top: 2.5%;
  width: 100%;
  height: 60vh; /* 화면의 높이를 100%로 설정 */  
}

.text-container {
  width: 80%; /* 너비를 80%로 조정 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px 0; /* 패딩 추가 */
  color: black;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.subtitle {
  font-size: 20px;
  font-weight: bold;
}

.description {
  font-size: 15px;
  color: grey;
}

.goToProduct-button,
.goToSurvey-button,
.goToCommunity-button,
.goToReview-button {
  background-color: black;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 20px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 15px;
  width: 300px;
}

.goToProduct-button:hover,
.goToSurvey-button:hover,
.goToCommunity-button:hover,
.goToReview-button:hover {
  background-color: rgba(87, 133, 57, 0.908);
}

.footer-container {
  background-color: rgba(82, 82, 82, 0.2); /* 유리 효과를 위한 반투명 배경 */
  color: #333; /* 텍스트 색상을 어두운 색으로 설정 */
  font-size: 14px;
  text-align: center;
  padding: 10px;
  position: fixed;
  width: 100%;
  bottom: 0;
  backdrop-filter: blur(10px) saturate(180%); /* 블러와 채도를 높여 유리 효과 추가 */
  -webkit-backdrop-filter: blur(10px) saturate(180%); /* 사파리 호환성 */
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* 유리 느낌을 주기 위한 테두리 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 추가 */
}
</style>
