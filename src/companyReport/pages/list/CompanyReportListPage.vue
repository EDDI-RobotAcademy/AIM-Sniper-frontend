<template>
  <div class="background-image">
    <v-container>
      <v-row class="justify-center align-center">
        <v-col cols="3">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="카테고리 선택"
            class="category-select"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="searchQuery"
            label="검색"
            prepend-inner-icon="mdi-magnify"
            clearable
            class="search-input"
            outlined
          ></v-text-field>
        </v-col>
        <v-col v-if="isAdmin" cols="auto" class="text-right">
          <v-btn
            :to="{ name: 'CompanyReportRegisterPage' }"
            class="register-btn"
            height="40"
            outlined
          >
            상품 등록
          </v-btn>
        </v-col>
      </v-row>

      <h1
        class="section-title"
        @click="toggleVisibility('allCompanyReportsVisible')"
      >
        전체 상품 <v-icon small>mdi-chevron-down</v-icon>
      </h1>

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
          <v-alert type="info">등록된 전체 보고서가 없습니다!</v-alert>
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
const authenticationModule = "authenticationModule";

export default {
  computed: {
    ...mapState("companyReportModule", ["companyReports"]),
    ...mapState(authenticationModule, ["isAdmin"]),
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
    };
  },
  methods: {
    ...mapActions("companyReportModule", ["requestCompanyReportListToDjango"]),
    ...mapActions("userLogModule", ["requestCountClickToDjango"]), //유저가 상품을 눌렀을 때 상품 클릭 수가 늘어남
    goToCompanyReportReadPage(companyReportId) {
      const email = sessionStorage.getItem('email');
      
      this.$router.push({
        name: "CompanyReportReadPage",
        params: { companyReportId },
      });

      if (!email) {
        // email이 없으면 함수가 동작하지 않음
        console.log("로그인 정보가 없습니다. 상품 클릭 수가 기록되지 않습니다.");
        return;
      }
      this.requestCountClickToDjango({
        email: email,
        companyReport_id: companyReportId,
        purchase: this.purchase,
      });
    },
    toggleVisibility(section) {
      this[section] = !this[section];
    },
    changePage(page) {
      this.currentPage = page;
    },
    getImageUrl(imageName) {
        return require(`@/assets/images/uploadImages/${imageName}`);
    },
  },
  mounted() {
    this.requestCompanyReportListToDjango();
  },
};
</script>

<style>
.section-title {
  color: #0b0b0b;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  font-size: 24px;
  margin-top: 40px;
}

.register-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  box-shadow: none;
  text-transform: none;
}

.companyReport-card {
  transition: transform 0.2s ease-in-out;
}

.companyReport-card:hover {
  transform: scale(1.05);
}

.companyReport-title {
  font-size: 18px;
  font-weight: bold;
}

.companyReport-price {
  color: #ff5252;
  font-weight: 600;
}

.companyReport-image {
  border-bottom: 1px solid #f5f5f5;
}

.search-input .v-text-field__control {
  border-radius: 30px;
}

.category-select .v-input__control {
  border-radius: 30px;
  background-color: #fff;
}
</style>
