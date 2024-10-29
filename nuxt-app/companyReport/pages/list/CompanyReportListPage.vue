<template>
  <div class="background-image">
    <v-container class="custom-padding">
      <div>
        <v-row>
          <v-col cols="12">
            <h2 class="section-title">전체 보고서</h2>
          </v-col>
        </v-row>

        <!-- 기업 필터 -->
        <v-row>
          <v-col cols="12">
            <p @click="toggleFilter" class="filter-text">
              <v-icon left class="filter-icon">mdi-filter-variant</v-icon>
              기업 필터 <v-icon>mdi-chevron-down</v-icon>
            </p>
          </v-col>
        </v-row>
        <!-- 필터가 열리고 닫히는 부분 -->
        <v-slide-y-transition >
          <v-row v-show="showFilterTags" class="filter-tags-container">
            <v-col cols="12">
              <v-chip-group v-if="!resetChips" v-model="selectedKeywords" multiple column>
                <v-chip
                  v-for="(keyword, index) in keywords"
                  :key="index"
                  :value="keyword"
                  outlined
                  :class="{
                    'chip-selected': selectedKeywords.includes(keyword),
                  }"
                  class="filter-chip"
                >
                  {{ keyword }}
                </v-chip>
                <v-btn @click="clearSelectedKeywords" class="reset-chip" outlined elevation="1">
                  <v-icon left>mdi-refresh</v-icon>
                  초기화
                </v-btn>
              </v-chip-group>
            </v-col>
          </v-row>
        </v-slide-y-transition>
        <!-- 검색 입력 -->
        <v-row class="my-8" justify="center">
          <v-col cols="10">
            <div class="search">
              <input
                type="text"
                class="search-input"
                v-model="searchQuery"
                placeholder="검색하고 싶은 기업명을 입력하세요"
              />
              <button class="search-button" @click="onSearch"></button>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- <v-row class="justify-center align-center mt-15 mb-15">
        <v-col
          v-for="(companyReport, index) in topNCompanyReportList"
          :key="index"
          cols="12"
          sm="4"
          md="3"
          lg="2"
        >
          <div class="popular-company">
            <div class="border-top"></div>
            <span><h5>AI - Report 추천</h5></span>
            <div class="img">
              <img
                :src="getImageUrl(companyReport.companyReportTitleImage)"
                alt="Dynamic Image"
              />
            </div>
            <span>{{ companyReport.companyReportName }}</span>
            <p class="price">✨조회 Top {{ index + 1 }}✨</p>
            <button
              @click="goToCompanyReportReadPage(companyReport.companyReportId)"
            >
              click
            </button>
          </div>
        </v-col>
      </v-row> -->

      <v-row
        class="companyReport-container"
        v-if="
          allCompanyReportListVisible && paginatedCompanyReportList.length > 0
        "
      >
        <v-col
          v-for="(companyReport, index) in paginatedCompanyReportList"
          :key="index"
          cols="12"
          sm="4"
          md="3"
          lg="2"
        >
          <v-card
            class="companyReport-card"
            @click="goToCompanyReportReadPage(companyReport.companyReportId)"
            hover
            outlined
          >
            <div class="companyReport-img-container">
              <v-img
                class="companyReport-scaled-img"
                :src="getImageUrl(companyReport.companyReportTitleImage)"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </div>
            <v-card-title class="companyReport-title">{{
              companyReport.companyReportName
            }}</v-card-title>
            <v-card-subtitle class="companyReport-price"
              >{{ companyReport.companyReportPrice }}원</v-card-subtitle
            >
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="allCompanyReportListVisible" class="report-loader" justify="center" align="center">
        <v-col cols="auto">
          <div class="typewriter ml-10">
            <div class="slide"><i></i></div>
            <div class="paper"></div>
            <div class="keyboard"></div>
          </div>
          <p class="text-center mt-5">기업 요약을 만들고 있습니다</p>
        </v-col>
      </v-row>
      <v-row v-if="filteredCompanyReportList.length > itemsPerPage">
        <v-col cols="12" class="text-center">
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(filteredCompanyReportList.length / itemsPerPage)"
            @input="changePage"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompanyReportStore } from "../../stores/companyReportStore";
import { useAccountStore } from "../../../account/stores/accountStore";
import { useAuthenticationStore } from "../../../authentication/stores/authenticationStore";
import { useNaverAuthenticationStore } from "../../../naverAuthentication/stores/naverAuthenticationStore";
import { useUserLogStore } from "../../../userLog/store/userLogStore";

const router = useRouter();
const companyReportStore = useCompanyReportStore();
const userLogStore = useUserLogStore();
const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();
// const googleauthenticationStore = useGoogleAuthenticationStore();
const naverauthenticationStore = useNaverAuthenticationStore();

// 페이지 관련 변수
const currentPage = ref(1);
const itemsPerPage = ref(30);

// 필터링 및 검색 관련 변수
const selectedKeywords = ref([]);
const keywords = ref([ "플랫폼", "정보보안", "빅데이터", "소프트웨어", "하드웨어", "클라우드", "컨설팅", "헬스케어", "메타버스", "인프라", "게임", "의료", "AI", "디스플레이", "마케팅/광고", "영상 분석", "네트워크", "금융지원",]);
const categories = ref(["전체", "IT", "플랫폼", "은행"]);
const selectedCategory = ref("전체");
const searchQuery = ref("");
const isSidebarOpen = ref(false);
const showFilterTags = ref(false);

// 보고서 관련 변수
const allCompanyReportListVisible = ref(true);
const purchase = ref(false);
const topN = ref(3);
const topList = ref([]);
const topNCompanyReportList = ref([]);

onMounted(async () => {
  // 전체 보고서 가져오기
  await companyReportStore.requestCompanyReportListToDjango();

  // topN ID 가져오기
  const response =
    await companyReportStore.requestTopNCompanyReportListToDjango(topN.value);
  topList.value = response.data;

  // topN 보고서 필터링
  topNCompanyReportList.value = companyReportStore.companyReportList.filter(
    (companyReport) => {
      return topList.value.some(
        (topId) => topId === companyReport.companyReportId
      );
    }
  );
});

const filteredCompanyReportList = computed(() => {
  let reports = companyReportStore.companyReportList;

  // 키워드 필터링 - selectedKeywords가 비어있거나 첫 번째 값이 "전체"인 경우 전체 보고서를 반환
  if (selectedKeywords.value.length > 0 && selectedKeywords.value.length == 0) {
    reports = reports.filter((report) => {
      if (report.keyword) {
        const keywordsArray = report.keyword.split(",");
        return selectedKeywords.value.some((keyword) =>
          keywordsArray.includes(keyword)
        );
      }
      return false;
    });
  }

  // 카테고리 필터링
  if (selectedCategory.value !== "전체") {
    reports = reports.filter((report) => {
      const categories = Array.isArray(report.categories)
        ? report.categories
        : report.categories
        ? report.categories.split(",")
        : [];
      return categories.includes(selectedCategory.value);
    });
  }

  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    reports = reports.filter((report) =>
      report.companyReportName.toLowerCase().includes(query)
    );
  }

  // 키워드와의 일치 개수에 따라 정렬
  if (selectedKeywords.value.length > 0 && selectedKeywords.value[0] !== "") {
    reports = reports.map((report) => {
      if (report.keyword) {
        const keywordsArray = report.keyword.split(",");
        // 일치하는 키워드의 수 계산
        report.matchCount = selectedKeywords.value.reduce(
          (count, keyword) =>
            keywordsArray.includes(keyword) ? count + 1 : count,
          0
        );
      } else {
        report.matchCount = 0;
      }
      return report;
    });

    // 일치 개수를 기준으로 내림차순 정렬
    reports.sort((a, b) => b.matchCount - a.matchCount);
  }

  return reports;
});

const paginatedCompanyReports = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCompanyReportList.splice(
    startIndex,
    startIndex + itemsPerPage.value
  );
});

// 페이지네이션 처리된 보고서 리스트 계산
const paginatedCompanyReportList = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const list = Array.isArray(filteredCompanyReportList.value)
    ? filteredCompanyReportList.value
    : [];
  return list.slice(startIndex, startIndex + itemsPerPage.value);
});

// 사이드바 토글
function toggleSidebar() {
  isSidebarOpen.value = true;
}

// 필터 토글
function toggleFilter() {
  showFilterTags.value = !showFilterTags.value;
}
const resetChips = ref(false);

function clearSelectedKeywords() {
  // selectedKeywords가 이미 빈 배열인 경우 아무 것도 하지 않음
  if (selectedKeywords.value.length === 0) return;

  // 키워드를 완전히 초기화하기 위해 splice 사용
  selectedKeywords.value.splice(0, selectedKeywords.value.length);

  // 강제로 reset 플래그를 변경해 갱신 유도
  resetChips.value = true;
  nextTick(() => {
    resetChips.value = false;
  });
}

// 페이지 이동
function goToCompanyReportReadPage(companyReportId) {
  const email = sessionStorage.getItem("email");
  router.push(`/companyReport/read/${companyReportId}`);

  if (!email) {
    // [TODO] 로그인&구매 시 상품 보여주기
    // return;
  }
  
  // if (googleAuthenticationStore.isGoogleAdmin || authenticationStore.isKakaoAdmin || naverAuthenticationStore.isNaverAdmin || accountStore.isNormalAdmin ) {
    //   return
    // }
    userLogStore.requestCountClickToDjango({
      email: email,
      companyReport_id: companyReportId,
      purchase: false,
    });
};

function changePage(page) {
  currentPage.value = page;
}

const getImageUrl = (imageName) => {
  if (!imageName) {
    return new URL(`/assets/images/fixed/AIM_BI_Simple.png`, import.meta.url)
      .href;
  }
  return new URL(`/assets/images/uploadImages/${imageName}`, import.meta.url)
    .href;
};

function toggleKeyword(keyword) {
  // TODO 전체가 아니라 빈값일 때 전체를 던지도록 수정
  if (keyword)
    if (keyword === "전체") {
      selectedKeywords.value = ["전체"];
    } else {
      const index = selectedKeywords.value.indexOf("전체");
      if (index !== -1) {
        selectedKeywords.value.splice(index, 1);
      }

      if (selectedKeywords.value.includes(keyword)) {
        selectedKeywords.value = selectedKeywords.value.filter(
          (k) => k !== keyword
        );
      } else {
        selectedKeywords.value.push(keyword);
      }

      if (selectedKeywords.value.length === 0) {
        selectedKeywords.value.push("전체");
      }
    }
}

useHead({
  title: `전자공시시스템(DART) 기반 기업 핵심 정보 분석 | `,
  meta: [
    {
      name: 'description',
      content: '기업의 사업 내용, 공략 포인트, 재무제표, 핵심만 요약했습니다. 전자공시시스템(DART) 기반 기업 핵심 정보 분석 🎯AIM에서 확인해보세요.',
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: '취업 준비, 면접 준비, 개발자 취업 준비, 개발자 이직 준비, 개발자 자소서, 개발자 취업 사이트, it취업, it 회사, 기업 분석 사이트, 기업 분석 보고서 사이트, 사업 요약, dart 분석, 다트 분석, 재무 분석, 사업 분석, 주사업, 사업 현황, 사업내용, 기업 분석 및 사업 요약, 다트 재무 분석, 사업 분석 및 요약, 기업 분석 사이트, 사업 요약 사이트, 기업 재무 제표 분석 사이트, 기업 타당성 분석, 회사소개, 회사 사업 소개, DART 분석, 지원동기 작성, aim 기업 요약 사이트, 에임 기업 요약 사이트, 에임, 애임, AIM, AIM Sniper, AIM 기업 분석, AIM 기업 요약',
    },
  ],
});
</script>

<style scoped>
.background-image {
  margin-top: 10vh;
}

@font-face {
  font-family: "Pretendard";
  src: url("@/assets/fonts/Pretendard.ttf") format("truetype");
  font-weight: 400;
}

.custom-padding {
  padding-left: 2%;
  padding-right: 2%;
}

.register-btn {
  font-size: 16px;
  background-color: #f5f5f5;
  color: blue !important;
  border: 1px solid #ccc !important;
  box-shadow: none;
  border: 1px solid (109, 109, 109, 0.5);
  text-transform: none;
}

.section-title {
  color: #0a28b0;
  font-family: "Pretendard", sans-serif !important;
  font-weight: bold;
  font-size: 24px;
  margin-left: 10px;
  margin-top: 10px;
}

::v-deep .v-field {
  height: 50px;
  background-color: #83838300 !important;
  color: rgb(37, 47, 133) !important;
  border-radius: 15px 15px 0px 0px !important;
}

.companyReport-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* text-align: center; */
  padding: 12px;
}

.companyReport-card {
  transition: transform 0.2s ease-in-out;
  border-radius: 32px;
  box-shadow: 0 1px 3px rgb(206, 205, 205);
}

.companyReport-card:hover {
  transform: scale(1.05);
}

.companyReport-img-container {
  position: relative;
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.companyReport-scaled-img {
  width: 20%;
  height: auto;
  transition: transform 0.3s ease; /* 애니메이션 효과 추가 */
  /* border-bottom: 1px */
  padding: 50px;
}

.companyReport-title {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  padding-top: 0px;
}

.companyReport-price {
  color: #9452ff;
  font-weight: 600;
  margin-left: 10px;
}

.companyReport-image {
  border-bottom: 1px solid #f5f5f5;
}

.popular-company {
  width: 10vw;
  height: 200px;
  background: #0a28b0;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 15px;
  box-shadow: 1px 3px 30px 3px #1f199d6b;
  position: relative; /* 레이저를 감싸는 요소의 위치 지정 */
}

.popular-company .border-top {
  width: 70%;
  height: 3%;
  background: #8094f4;
  margin: auto;
  border-radius: 0px 0px 15px 15px;
}

.popular-company span {
  font-weight: 600;
  color: white;
  text-align: center;
  display: block;
  padding-top: 10px;
  font-size: 16px;
}

.popular-company .price {
  font-weight: 400;
  color: white;
  display: block;
  text-align: center;
  padding-top: 3px;
  font-size: 12px;
}

.popular-company .img {
  width: 120px;
  height: 70px;
  /* background: #8094F4; */
  border-radius: 15px;
  margin: auto;
  margin-top: 25px;
}

.popular-company button {
  padding: 8px 15px;
  display: block;
  margin: auto;
  border-radius: 8px;
  border: none;
  margin-top: 20px;
  background: #8094f4;
  color: white;
  font-weight: 600;
}

.popular-company button:hover {
  background: #534bf3;
}
.keyword-btn {
  border-radius: 8px;
  color: #1e68d1;
  padding: 4px 12px;
  width: auto;
  height: 3vh;
}

.section-title {
  margin: 0; /* 기본적인 여백 제거 */
}

.filter-text {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.filter-text:hover {
  color: #8094f4; /* 필터를 누를 때 색상이 변함 */
}

/* 필터 태그 컨테이너: 불필요한 배경색 제거 */
.filter-tags-container {
  margin-top: 10px;
  padding: 0;
}

/* 필터 칩 스타일링 */
.filter-chip {
  margin: 5px;
  font-size: 14px;
}

.chip-selected {
  background-color: #8094f4; /* 선택된 칩의 배경색을 초록색으로 변경 */
  color: white; /* 텍스트 색상을 하얀색으로 변경 */
}

.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}

.search-input {
  font-family: inherit;
  font-size: inherit;
  background-color: #f4f2f2;
  border: none;
  color: #646464;
  padding: 0.7rem 1rem;
  border-radius: 30px;
  width: 100%;
  transition: all ease-in-out 0.5s;
  margin-right: -2rem;
}

.search-input:hover,
.search-input:focus {
  box-shadow: 0 0 1em #00000013;
}

.search-input:focus {
  outline: none;
  background-color: #f0eeee;
}

.search-input::-webkit-input-placeholder {
  font-weight: 100;
  color: #ccc;
}

.search-input:focus + .search-button {
  background-color: #f0eeee;
}

.search-button {
  border: none;
  background-color: #f4f2f2;
  margin-top: 0.1em;
}

.search-button:hover {
  cursor: pointer;
}

/* From Uiverse.io by Nawsome */ 
.report-loader {
  margin-top: 130px;
  color: #646464;
}

.typewriter {
  --blue: #5C86FF;
  --blue-dark: #275EFE;
  --key: #fff;
  --paper: #EEF0FD;
  --text: #D3D4EC;
  --tool: #FBC56C;
  --duration: 3s;
  position: relative;
  -webkit-animation: bounce05 var(--duration) linear infinite;
  animation: bounce05 var(--duration) linear infinite;
}

.typewriter .slide {
  width: 92px;
  height: 20px;
  border-radius: 3px;
  margin-left: 14px;
  transform: translateX(14px);
  background: linear-gradient(var(--blue), var(--blue-dark));
  -webkit-animation: slide05 var(--duration) ease infinite;
  animation: slide05 var(--duration) ease infinite;
}

.typewriter .slide:before, .typewriter .slide:after,
.typewriter .slide i:before {
  content: "";
  position: absolute;
  background: var(--tool);
}

.typewriter .slide:before {
  width: 2px;
  height: 8px;
  top: 6px;
  left: 100%;
}

.typewriter .slide:after {
  left: 94px;
  top: 3px;
  height: 14px;
  width: 6px;
  border-radius: 3px;
}

.typewriter .slide i {
  display: block;
  position: absolute;
  right: 100%;
  width: 6px;
  height: 4px;
  top: 4px;
  background: var(--tool);
}

.typewriter .slide i:before {
  right: 100%;
  top: -2px;
  width: 4px;
  border-radius: 2px;
  height: 14px;
}

.typewriter .paper {
  position: absolute;
  left: 24px;
  top: -26px;
  width: 40px;
  height: 46px;
  border-radius: 5px;
  background: var(--paper);
  transform: translateY(46px);
  -webkit-animation: paper05 var(--duration) linear infinite;
  animation: paper05 var(--duration) linear infinite;
}

.typewriter .paper:before {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: 7px;
  border-radius: 2px;
  height: 4px;
  transform: scaleY(0.8);
  background: var(--text);
  box-shadow: 0 12px 0 var(--text), 0 24px 0 var(--text), 0 36px 0 var(--text);
}

.typewriter .keyboard {
  width: 120px;
  height: 56px;
  margin-top: -10px;
  z-index: 1;
  position: relative;
}

.typewriter .keyboard:before, .typewriter .keyboard:after {
  content: "";
  position: absolute;
}

.typewriter .keyboard:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  transform: perspective(10px) rotateX(2deg);
  transform-origin: 50% 100%;
}

.typewriter .keyboard:after {
  left: 2px;
  top: 25px;
  width: 11px;
  height: 4px;
  border-radius: 2px;
  box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  -webkit-animation: keyboard05 var(--duration) linear infinite;
  animation: keyboard05 var(--duration) linear infinite;
}

@keyframes bounce05 {
  85%, 92%, 100% {
    transform: translateY(0);
  }

  89% {
    transform: translateY(-4px);
  }

  95% {
    transform: translateY(2px);
  }
}

@keyframes slide05 {
  5% {
    transform: translateX(14px);
  }

  15%, 30% {
    transform: translateX(6px);
  }

  40%, 55% {
    transform: translateX(0);
  }

  65%, 70% {
    transform: translateX(-4px);
  }

  80%, 89% {
    transform: translateX(-12px);
  }

  100% {
    transform: translateX(14px);
  }
}

@keyframes paper05 {
  5% {
    transform: translateY(46px);
  }

  20%, 30% {
    transform: translateY(34px);
  }

  40%, 55% {
    transform: translateY(22px);
  }

  65%, 70% {
    transform: translateY(10px);
  }

  80%, 85% {
    transform: translateY(0);
  }

  92%, 100% {
    transform: translateY(46px);
  }
}

@keyframes keyboard05 {
  5%, 12%, 21%, 30%, 39%, 48%, 57%, 66%, 75%, 84% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  9% {
    box-shadow: 15px 2px 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  18% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 2px 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  27% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 12px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  36% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 12px 0 var(--key), 60px 12px 0 var(--key), 68px 12px 0 var(--key), 83px 10px 0 var(--key);
  }

  45% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 2px 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  54% {
    box-shadow: 15px 0 0 var(--key), 30px 2px 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  63% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 12px 0 var(--key);
  }

  72% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 2px 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 10px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }

  81% {
    box-shadow: 15px 0 0 var(--key), 30px 0 0 var(--key), 45px 0 0 var(--key), 60px 0 0 var(--key), 75px 0 0 var(--key), 90px 0 0 var(--key), 22px 10px 0 var(--key), 37px 12px 0 var(--key), 52px 10px 0 var(--key), 60px 10px 0 var(--key), 68px 10px 0 var(--key), 83px 10px 0 var(--key);
  }
}
</style>
