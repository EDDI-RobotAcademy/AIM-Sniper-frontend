<template>
  <div>
    <!-- <v-row class="justify-center align-center mt-15 mb-15">
      <v-col
        v-for="(companyReport, index) in topNCompanyReports"
        :key="index"
        cols="12"
        sm="4"
        md="3"
        lg="2"
      >
        <div class="popular-company">
          <div class="border-top"></div>
          <div class="img">
              <img 
              :src="getImageUrl(companyReport.companyReportTitleImage)">
          </div>
          <span>{{ companyReport.companyReportName }}</span>
          <p class="price"> ✨조회 Top {{ index + 1 }}✨ </p>
          <button 
            @click="goToCompanyReportReadPage(companyReport.companyReportId)"> 
            click
          </button>
        </div>
      </v-col>
    </v-row> -->
  </div>
  <div class="background-image">
    <v-container class="custom-padding">
      <v-row>
        <v-col v-if="isNormalAdmin || isGoogleAdmin || isKakaoAdmin || isNaverAdmin" cols="auto" class="text-right">
          <v-btn
            :to="{ name: 'CompanyReportRegisterPage' }"
            class="register-btn"
            width="100vw"
            color="white"
            outlined
          >
            상품 등록
          </v-btn>
        </v-col>
      </v-row>
          

      <v-row>
        <v-col cols="3">
          <h2 class="section-title"> 전체 보고서 </h2>
        </v-col>
        <v-col cols="3">
          <!-- 여백용 -->
        </v-col>
        
        <v-col cols="2">
          <v-select
            v-model="selectedCategory"
            :items="categories"            
            class="category-select"
            outlined            
          ></v-select>
        </v-col>
        
        <v-col cols="4">
          <v-text-field
            v-model="searchQuery"
            label="검색 내용을 입력하세요"
            prepend-inner-icon="mdi-magnify"
            clearable
            class="search-input"
            outlined
          ></v-text-field>
        </v-col>        
      </v-row>

      
      <br>
      <br>
      <br>
      <v-row
        v-if="allCompanyReportsVisible && paginatedCompanyReports.length > 0"
      >
        <v-col
          v-for="(companyReport, index) in paginatedCompanyReports"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"          
        >
          <v-card
            class="companyReport-card"
            @click="goToCompanyReportReadPage(companyReport.companyReportId)"
            hover
            outlined
          >
            <v-img
              :src="getImageUrl(companyReport.companyReportTitleImage)"
              aspect-ratio="1.5"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-img>
            <v-card-title class="companyReport-title">{{
              companyReport.companyReportName
            }}</v-card-title>
            <v-card-subtitle class="companyReport-price"
              >{{ companyReport.companyReportPrice }}원</v-card-subtitle
            >
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="allCompanyReportsVisible">
        <v-col cols="12" class="text-center">
          <v-alert type="info">등록된 보고서가 없습니다!</v-alert>
        </v-col>
      </v-row>

      <v-row v-if="filteredCompanyReports.length > itemsPerPage">
        <v-col cols="12" class="text-center">
          <v-pagination
            v-model="currentPage"
            :length="Math.ceil(filteredCompanyReports.length / itemsPerPage)"
            @input="changePage"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
const accountModule = "accountModule";
const authenticationModule = "authenticationModule";
const googleAuthenticationModule = "googleAuthenticationModule";
const naverAuthenticationModule = "naverAuthenticationModule";

export default {
  computed: {
    ...mapState("companyReportModule", ["companyReports"]),
    ...mapState(authenticationModule, ["isKakaoAdmin"]),
    ...mapState(googleAuthenticationModule, ['isGoogleAdmin']),
    ...mapState(accountModule, ['isNormalAdmin']),
    ...mapState(naverAuthenticationModule, ['isNaverAdmin']),
    paginatedCompanyReports() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCompanyReports.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
    },
    filteredCompanyReports() {
      let companyReports = this.companyReports;

      if (this.selectedCategory !== "전체") {
        companyReports = companyReports.filter(
          (companyReport) =>
            companyReport.companyReportCategory === this.selectedCategory
        );
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        companyReports = companyReports.filter((companyReport) =>
          companyReport.companyReportName.toLowerCase().includes(query)
        );
      }
      return companyReports;
    },
    topNCompanyReports() {
      let companyReports = this.companyReports;
      companyReports = companyReports.filter(
          (companyReport) => {
            return this.topList.some(topId => topId === companyReport.companyReportId);
      });
      
      return companyReports;
    },
  },
  data() {
    return {
      categories: ["전체", "IT", "플랫폼", "은행"],
      selectedCategory: "전체",
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 8,
      allCompanyReportsVisible: true,
      purchase: false,
      topN: 5,
      topList: [],
    };
  },
  methods: {
    ...mapActions("companyReportModule", ["requestCompanyReportListToDjango", "requestTopNCompanyReportListToDjango"]),
    ...mapActions("userLogModule", ["requestCountClickToDjango"]), //유저가 상품을 눌렀을 때 상품 클릭 수가 늘어남
    goToCompanyReportReadPage(companyReportId) {
      const email = sessionStorage.getItem('email');
      
      this.$router.push({
        name: "CompanyReportReadPage",
        params: { companyReportId },
      });

      if (!email) {
        // email이 없으면 함수가 동작하지 않음
        // console.log("로그인 정보가 없습니다. 상품 클릭 수가 기록되지 않습니다.");
        return;
      }
      if(this.isGoogleAdmin || this.isKakaoAdmin || this.isNaverAdmin || this.isNormalAdmin){
        // 관리자는 갯수를 세지 않습니다.
        // console.log("로그인 정보가 없습니다. 상품 클릭 수가 기록되지 않습니다.");
        return;
      }
      this.requestCountClickToDjango({
        email: email,
        companyReport_id: companyReportId,
        purchase: this.purchase,
      });
    },
    changePage(page) {
      this.currentPage = page;
    },
    getImageUrl(imageName) {
      return require(`@/assets/images/uploadImages/${imageName}`);
    },
  },
  async mounted() {
    this.requestCompanyReportListToDjango();

    const response = await this.requestTopNCompanyReportListToDjango(this.topN);
    if (response && response.data) {
      this.topList = response.data;
    }
  },
};
</script>



<style scoped>

@font-face {
  font-family:'Pretendard';
  src: url('@/assets/fonts/Pretendard.ttf') format('truetype');
  font-weight: 400;
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
  color: #0A28B0;
  font-family: "Pretendard", sans-serif !important;
  font-weight: bold;
  font-size: 30px;
  margin-left: 10px;
  margin-top: 10px;   
}

::v-deep .v-field {  
  background-color: #ffffff !important; 
  color: rgb(37, 47, 133) !important;    
  border-radius: 5px !important;    
}


.custom-padding {
  padding-left: 10%;
  padding-right: 10%;
}

.companyReport-card {
  transition: transform 0.2s ease-in-out;
  border-radius: 32px;  
  box-shadow: 0 1px 3px rgb(206, 205, 205); 
}

.companyReport-card:hover {
  transform: scale(1.05);
}

.companyReport-title {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}

.companyReport-price {  
  color: #9452ff;
  font-weight: 600;
  margin-left: 10px;
  margin-bottom: 10px;
}

.companyReport-image {
  border-bottom: 1px solid #f5f5f5;
}

.popular-company {
  width: 190px;
  height: 240px;
  width: 190px;
  height: 240px;
  background: #0A28B0;
  border-radius: 15px;
  box-shadow: 1px 5px 60px 11px #1f199d6b;
}

.popular-company .border-top {
  width: 60%;
  height: 3%;
  background: #8094F4;
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
  width: 100px;
  height: 70px;
  /* background: #8094F4; */
  border-radius: 15px;
  margin: auto;
  margin-top: 25px;
}

.popular-company button {
  padding: 8px 25px;
  display: block;
  margin: auto;
  border-radius: 8px;
  border: none;
  margin-top: 20px;
  background: #8094F4;
  color: white;
  font-weight: 600;
}

.popular-company button:hover {
  background: #534bf3;
}
</style>