<template>
  <div class="home-container">
    <img :src="imageSrc" alt="Home Image" class="home-image" />

    <div class="text-container">
      <h2 class="title">AICORP-INSIGHT-MARKET</h2>
      <p class="subtitle">SINCE 2024</p>
      <p class="description">
        AIM <br/>
      </p>

      <!-- Buttons -->
      <div class="buttons">
        <button class="goToProduct-button" @click="goToProductList">
          회사 분석 상품 구경하기
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-container">
      <p class="company-info">
        법인명(상호): AIM-SNIPER 대표자(성명): 민경원 사업자 등록번호 안내:
        [123-41241-3]
      </p>
      <p class="contact-info">
        통신판매업 신고 제 2019-플레이데이터-072호 주소: 서울특별시 금천구 가산디지털1로
        25 플레이데이터18층<br />
        이메일: issueissue@kakao.com 전화: 02-1234-5678 입금계좌: 우리은행
        3123-6243-029458 (주) AIM-SNIPER
      </p>
      <p class="privacy-info">개인정보보호책임자: 잇슈컴퍼니(issueissue@kakao.com)</p>
      <p class="reserved-info">2024 IssueIssue Korea LLC. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import imageSrc from "@/assets/images/homeImages/back3.png";
import router from "@/router";
import { mapActions, mapState } from "vuex";
const authenticationModule = "authenticationModule";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      imageSrc,
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  methods: {
    ...mapActions(authenticationModule, ["requestLogoutToDjango"]),

    goToProductList() {
      router.push("/product/list");
    },
    goToCommunityList() {
      router.push("/community/list");
    },
    goToReviewList() {
      router.push("/review/list");
    },
  },
});
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.home-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
}

.text-container {
  margin-top: 30px;
}

.subtitle {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  margin-top: 10px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 10px;
}

.description {
  font-size: 18px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 30px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goToProduct-button,
.goToCommunity-button,
.goToReview-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.goToProduct-button:hover,
.goToCommunity-button:hover,
.goToReview-button:hover {
  background-color: #45a049;
}

.footer-container {
  text-align: center;
  padding: 20px;
  background-color: #333;
  color: #ccc;
  margin-top: 40px;
  width: 100%;
  border-radius: 10px;
}

.footer-container p {
  margin: 5px 0;
  font-size: 14px;
}
</style>
