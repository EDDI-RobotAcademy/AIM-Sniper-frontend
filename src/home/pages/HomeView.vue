<template>
  <div class="home-container">
    <img :src="imageSrc" alt="Home Image" class="home-image" />

    <div class="text-container">
      <h2 class="title">"We make positive movement in Korean running culture."</h2>
      <div style="margin-top: 60px; margin-bottom: 20px"></div>
      <p class="subtitle">SINCE 2024</p>
      <div style="margin-bottom: 10px"></div>
      <p class="description">
        잇슈는 양질의 컨텐츠로 러닝의 즐거움과 감동을 <br />
        보다 많은 사람들과 공유할 수 있도록 최선을 다 할 것입니다.
      </p>
      <div class="buttons">
        <button class="goToProduct-button" @click="goToProductList">
          러닝화 상품 구경하기
        </button>
        <button class="goToCommunity-button" @click="goToCommunityList">
          커뮤니티 이동하기
        </button>
        <button class="goToReview-button" @click="goToReviewList">별점 리뷰 달기</button>
      </div>
    </div>

    <div class="footer-container">
      <p class="company-info">
        법인명(상호): 주식회사 잇슈잇슈 대표자(성명): 윤서팍 사업자 등록번호 안내:
        [123-41241-3]
      </p>
      <p class="contact-info">
        통신판매업 신고 제 2019-플레이데이터-072호 주소: 서울특별시 금천구 가산디지털1로
        25 플레이데이터18층<br />
        이메일: issueissue@kakao.com 전화: 02-1234-5678 입금계좌: 우리은행
        3123-6243-029458 (주)잇슈컴퍼니
      </p>
      <p class="privacy-info">개인정보보호책임자: 잇슈컴퍼니(issueissue@kakao.com)</p>
      <p class="reserved-info">2024 IssueIssue Korea LLC. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import imageSrc from "@/assets/images/homeImages/image1.jpg";
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
  text-align: center;
}

.home-image {
  width: 100%;
  height: auto;
  margin: auto;
  display: block;
  object-fit: cover;
}

.text-container {
  margin-top: 20px;
}

.subtitle {
  font-size: 35px;
  font-weight: bold;
}

.title {
  font-size: 30px;
  font-weight: bold;
  margin: 10px 0;
}

.description {
  font-size: 18px;
  color: #777;
}

.buttons {
  margin-top: 20px;
}

.goToProduct-button,
.goToCommunity-button,
.goToReview-button {
  background-color: black;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 20px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 20px;
  width: 300px;
}

.goToProduct-button:hover,
.goToCommunity-button:hover,
.goToReview-button:hover {
  background-color: rgba(87, 133, 57, 0.908);
}

.footer-container {
  text-align: left;
  margin-top: 50px;
  padding: 20px;
  background-color: #000000;
}

.footer-container p {
  color: #9b9b9b;
  font-size: 13px;
}

.company-info,
.contact-info,
.privacy-info,
.additional-links {
  margin: 10px 0;
  color: #555;
}

.social-media {
  margin-top: 20px;
}

.social-icon {
  width: 30px;
  height: 30px;
  margin: 0 10px;
}
</style>
