<template>
  <v-container>
    <v-col cols="2" class="d-flex align-center justify-center"> </v-col>

    <v-card v-if="companyReport">
      <v-card-title>상품 정보</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="5" class="d-flex align-center justify-center">
              <v-img
                :src="
                  getCompanyReportImageUrl(
                    companyReport.companyReportTitleImage
                  )
                "
                class="custom-img grey lighten-2"
                aspect-ratio="1"
                style="width: 100%; height: auto; max-height: 200px"
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
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <v-row>
                <v-col cols="12">
                  <h1 class="companyReport-name">
                    {{ companyReport.companyReportName }}
                  </h1>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <p class="companyReport-price">
                    {{ companyReport.companyReportPrice }}
                    <span class="original-price">{{
                      companyReport.originalPrice
                    }}</span>
                    <span class="currency">원</span>
                  </p>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn v-if="!(isKakaoAdmin || isGoogleAdmin || isNaverAdmin || isNormalAdmin)"
                    color="yellow darken-2"
                    dark
                    @click="confirmCheckout"
                    class="action-button"
                  >
                    <v-icon v-if="!(isKakaoAdmin || isGoogleAdmin || isNaverAdmin || isNormalAdmin)" left>mdi-cart</v-icon>구매하기
                  </v-btn>
                  <v-btn v-if="!(isKakaoAdmin || isGoogleAdmin || isNaverAdmin || isNormalAdmin)"
                    color="success"
                    @click="onAddToCartAndAsk"
                    class="action-button"
                  >
                    <v-icon left>mdi-cart-plus</v-icon>장바구니에 추가
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="5">
              <span>이 상품의 태그</span>
              <v-text-field
                class="custom-text-field"
                v-model="companyReport.companyReportCategory"
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <h2>1. 기업 개황</h2>
              <br>
              &nbsp;&nbsp;
              <span><b>주소:</b> {{ this.companyInfo.address }}</span>
              <br>
              &nbsp;&nbsp;
              <span><b>대표이사:</b> {{ this.companyInfo.ceo_name }}</span>
              <br>
              &nbsp;&nbsp;
              <span><b>회사 유형:</b> {{ this.companyInfo.company_class }}</span>
              <br>
              &nbsp;&nbsp;
              <span><b>회사 이름:</b> {{ this.companyInfo.company_name }}</span>
              <br>
              &nbsp;&nbsp;
              <span><b>설립 연도:</b> {{ this.companyInfo.est_date }}</span>
              <br>
              &nbsp;&nbsp;
              <b>웹사이트: </b><a :href="'https://' + companyInfo.website" target="_blank" rel="noopener">
                {{ companyInfo.website }}
              </a>
              <br>
              <br>
              <h2>2. 재무 현황</h2>
              <br>
              <v-col cols="12"><div ref="chart"></div></v-col>
              <!-- <div ref="chart"></div> -->
              <br>
              <br>
              <h2>3. 회사 요약</h2>
              <br>
              <span v-html="formattedSummary"></span>
            </v-col>
          </v-row>
          <v-row>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-alert v-else type="info">현재 등록된 상품이 없습니다!</v-alert>
    <v-spacer></v-spacer>
    <v-row justify="center" class="mt-4">
        <v-col cols="auto">
            <router-link
            :to="{ name: 'CompanyReportListPage' }"
            class="router-link no-underline"
            >
                <v-btn color="#E3EF76" class="action-button">
                    <v-icon left>mdi-arrow-left</v-icon>
                    <span>돌아가기</span>
                </v-btn>
            </router-link>
        </v-col>
        <button v-if="isNormalAdmin || isGoogleAdmin || isKakaoAdmin || isNaverAdmin" class="Btn" @click="deleteCompanyReport">
            <div class="sign">
                <svg
                viewBox="0 0 16 16"
                class="bi bi-trash3-fill"
                fill="currentColor"
                height="18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                ></path>
                </svg>
            </div>
            <div class="text">Delete</div>
        </button>
        <button v-if="isNormalAdmin || isGoogleAdmin || isKakaoAdmin || isNaverAdmin" class="pushable" @click="goToModifyPage">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front"> Modify </span>
        </button>
    </v-row>
    <v-dialog v-model="isCheckoutDialogVisible" max-width="500">
      <v-card>
        <v-card-title>Message</v-card-title>
        <v-card-text> 정말 구매하시겠습니까? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="isCheckoutDialogVisible = false"
            >취소</v-btn
          >
          <v-btn color="blue darken-1" text @click="onPurchase">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isGoToCartListDialogVisible" max-width="500">
      <v-card>
        <v-card-title>Message</v-card-title>
        <v-card-text>
          장바구니에 추가 되었습니다. 장바구니로 이동하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="isGoToCartListDialogVisible = false"
            >취소</v-btn
          >
          <v-btn color="blue darken-1" text @click="goToCartList">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import router from "@/router";
import userLogModule from "@/userLog/store/userLogModule";
import * as d3 from 'd3';
import axiosInst from "@/utility/axiosInstance"


const companyReportModule = "companyReportModule";
const cartModule = "cartModule";
const orderModule = "orderModule";
const accountModule = "accountModule";
const authenticationModule = "authenticationModule";
const googleAuthenticationModule = "googleAuthenticationModule";
const naverAuthenticationModule = "naverAuthenticationModule";

export default {
  props: {
    companyReportId: {
      type: String,
      required: true,
    },
    companyReportCategory: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isCheckoutDialogVisible: false,
      isGoToCartListDialogVisible: false,
      purchase: true,
      financeData: [],
      companyInfo: [],
      summary:'',
    };
  },
  computed: {
    ...mapState(companyReportModule, ["companyReport", "companyReports"]),
    ...mapState(authenticationModule, ["isAuthenticatedKakao", "isKakaoAdmin"]),
    ...mapState(googleAuthenticationModule, ["isAuthenticatedGoogle",'isGoogleAdmin']),
    ...mapState(accountModule, ["loginType", "isAuthenticatedNormal",'isNormalAdmin']),
    ...mapState(naverAuthenticationModule, ["isAuthenticatedNaver",'isNaverAdmin']),
    formattedSummary() {return this.summary.replace(/\n/g, '<br>');}
  },
  methods: {
    ...mapActions(companyReportModule, ["requestCompanyReportToDjango","requestDeleteCompanyReportToDjango","requestCompanyReportFinanceToDjango",
    'requestCompanyReportInfoToDjango',"requestCompanyReportSummaryToDjango"]),
    ...mapActions(cartModule, [
      "requestAddCartToDjango",
      "requestDeleteCartItemToDjango",
      "requestCartItemDuplicationCheckToDjango",
    ]),
    ...mapActions(orderModule, [
      "requestCompanyReportReadToAddOrderToDjango",
      "requestOrderItemDuplicationCheckToDjango",
    ]),
    ...mapActions(userLogModule, ["requestCountClickToDjango"]),
    async onPurchase() {
      this.isCheckoutDialogVisible = false;
      // console.log('이모티콘 구매')
      try {
        const email = sessionStorage.getItem("email");
        const payload = {
            email: email,
          companyReportId: this.companyReport.companyReportId,
        };
        // console.log('payload:', payload)
        const isDuplicatedOrderItem =
          await this.requestOrderItemDuplicationCheckToDjango(payload);
        // console.log('isDuplicate:', isDuplicatedOrderItem)
        if (isDuplicatedOrderItem) {
          alert("이미 구매하신 상품입니다.");
        } else {
          try {
            const email = sessionStorage.getItem("email");
            const payload = {
                email,
              companyReportId: this.companyReport.companyReportId,
              companyReportPrice: this.companyReport.companyReportPrice,
            };
            // console.log('orderItem:', payload)
            const response =
              await this.requestCompanyReportReadToAddOrderToDjango(payload);
            this.requestCountClickToDjango({
              companyReport_id: this.companyReport.companyReportId,
              purchase: this.purchase,
            });
            await this.requestDeleteCartItemToDjango({
              companyReportId: [this.companyReport.companyReportId],
            });
            // console.log('장바구니에 있었으면 삭제 성공')

            alert("구매가 완료되었습니다.");
          } catch (error) {
            console.log("상품 구매 중 에러 발생:", error);
          }
        }
      } catch (error) {
        console.log("이미 구매한 상품인지 확인 중 에러 발생:", error);
      }
    },
    async onAddToCartAndAsk() {
      // console.log('장바구니에 추가 버튼 눌렀음')
      try {
        const email = sessionStorage.getItem("email");
        const payload = {
            email: email,
          companyReportId: this.companyReport.companyReportId,
        };
        // console.log('payload:', payload)
        const isDuplicatedOrderItem =
          await this.requestOrderItemDuplicationCheckToDjango(payload);
        const isDuplicatedCartItem =
          await this.requestCartItemDuplicationCheckToDjango(payload);
        // console.log('isDuplicate:', isDuplicatedOrderItem)
        if (isDuplicatedOrderItem) {
          alert("이미 구매하신 상품입니다.");
        } else if (isDuplicatedCartItem) {
          alert("장바구니에 있는 상품입니다.");
        } else {
          try {
            this.isGoToCartListDialogVisible = true;
            const cartData = {
              companyReportId: this.companyReport.companyReportId,
              companyReportName: this.companyReport.companyReportName,
              companyReportPrice: this.companyReport.companyReportPrice,
            };
            await this.requestAddCartToDjango(cartData);
          } catch (error) {
            console.log("장바구니 추가 과정에서 에러 발생:", error);
          }
        }
      } catch (error) {
        console.log("이미 구매한 상품인지 확인 중 에러 발생:", error);
      }
    },
    async checkOrdersItemDuplication() {
      // console.log('닉네임 중복 검사')

      try {
        const isDuplicate =
          await this.requestOrdersItemDuplicationCheckToDjango({
            companyReportId: this.companyReport.companyReportId,
          });

        if (isDuplicate) {
          this.ordersItemErrorMessages = ["이 nickname은 이미 사용중입니다!"];
          this.isNicknameValid = false;
        } else {
          this.nicknameErrorMessages = [];
          this.isNicknameValid = true;
        }
      } catch (error) {
        alert("닉네임 중복 확인에 실패했습니다!");
        this.isNicknameValid = false;
      }
    },
    async deleteCompanyReport(){
        await this.requestDeleteCompanyReportToDjango(this.companyReportId)
        alert("보고서가 삭제되었습니다.")
        router.push("/companyReport/list")
    },
    getCompanyReportImageUrl(imageName) {
      return require(`@/assets/images/uploadImages/${imageName}`)
    },
    confirmCheckout() {
      this.isCheckoutDialogVisible = true;
    },
    goToCartList() {
        router.push("/cart/list");
    },
    goToModifyPage() {
      this.$router.push({
        name: "CompanyReportModifyPage",
        params: { companyReportId: this.companyReport.companyReportId },
      });
    },
    async fetchCompanyReportData(companyReportId) {
      await this.requestCompanyReportToDjango(companyReportId);
      if (this.companyReport && this.companyReport.companyReportCategory) {
        // console.log(this.companyReport.companyReportCategory);
      }
    },
    async getFinanceData() {
      // 데이터 확인
      let data = await this.requestCompanyReportFinanceToDjango(this.companyReport.companyReportName);
      let rawData = data.data;  
      this.financeData = rawData
      // 받은 데이터 변환
      // this.financeData = rawData.map(item => item[0]); // 배열에서 첫 번째 객체만 추출하여 저장
      // console.log(this.financeData); // 데이터 확인
    },
    async getCompanyInfo() {
      // 데이터 확인
      let data = await this.requestCompanyReportInfoToDjango(this.companyReport.companyReportName);
      this.companyInfo = data.data[0]
      // console.log(this.companyInfo)
    },
    async getCompanySummary(){
      let data = await this.requestCompanyReportSummaryToDjango(this.companyReport.companyReportName);
      this.summary = data.data
      // console.log(typeof this.summary)
    },
    createChart() {
      const margin = { top: 35, right: 15, bottom: 30, left: 28 };
      const width = 240 - margin.left;
      const height = 400 - margin.top - margin.bottom;

      const years = [2021, 2022, 2023];

      // 각 지표에 대한 막대 생성
      const metrics = [
        { key: 'revenue', color: 'steelblue', label: '재무 지표 매출액(단위: 천억원)' },
        { key: 'receivable_turnover', color: 'green', label: '매출 채권 회전율(단위: %)' },
        { key: 'operating_cash_flow', color: 'red', label: '영업 활동 현금 흐름(단위: 천억원)' }
      ];

      // 각 지표에 대해 그래프 생성
      metrics.forEach((metric, metricIndex) => {
        // SVG 생성
        const svg = d3
          .select(this.$refs.chart)
          .append('svg')
          .attr('width', width + margin.left)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        // X축 (년도)
        const x0 = d3.scaleBand()
          .domain(years)
          .range([0, width])
          .paddingInner(0.1); // 연도 간격 조정

        // Y축 (지표 값)
        const yMax = d3.max([
          d3.max(this.financeData['2021'], d => d[metric.key]),
          d3.max(this.financeData['2022'], d => d[metric.key]),
          d3.max(this.financeData['2023'], d => d[metric.key]),
        ]);

        const y = d3.scaleLinear()
          .domain([0, yMax])
          .range([height, 0]);

        // Y축 추가 및 단위 표시 (revenue와 operating_cash_flow에 대해서만 적용)
        if (metric.key === 'revenue') {
          const yAxisFormatted = d3.axisLeft(y).tickFormat(d => (d / 100000000000).toFixed(1)); // 천억원 단위로 변환
          svg.append('g').call(yAxisFormatted);
          svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)') // Y축 레이블 수직으로 회전
            .attr('y', -40) // Y축 레이블 위쪽 위치 조정
            .attr('x', -height / 2) // X축 레이블 위치 조정
            .attr('text-anchor', 'middle')
        } else if (metric.key === 'operating_cash_flow') {
          const yAxisFormatted = d3.axisLeft(y).tickFormat(d => (d / 100000000000).toFixed(1)); // 천억원 단위로 변환
          svg.append('g').call(yAxisFormatted);
          svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)') // Y축 레이블 수직으로 회전
            .attr('y', -40) // Y축 레이블 위쪽 위치 조정
            .attr('x', -height / 2) // X축 레이블 위치 조정
            .attr('text-anchor', 'middle')
        } else {
          const yAxis = svg.append('g').call(d3.axisLeft(y));
          svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
        }

        // 각 지표에 대한 막대 추가
        svg.selectAll(`.${metric.key}`)
          .data(years.map(year => ({
            year: year,
            value: this.financeData[year].length > 0 ? this.financeData[year][0][metric.key] : 0,
          })))
          .enter()
          .append('rect')
          .attr('class', metric.key)
          .attr('x', d => x0(d.year))
          .attr('y', d => y(d.value))
          .attr('width', x0.bandwidth())
          .attr('height', d => height - y(d.value))
          .attr('fill', metric.color);

        // X축 추가
        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x0));

        // 제목 추가
        svg.append('text')
          .attr('class', 'chart-title')
          .attr('x', width / 2) // 가운데 정렬
          .attr('y', -10) // Y축 위쪽으로 위치 조정
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .text(metric.label); // 각 지표 레이블로 제목 추가
      });
    }
  },
  async created() {
    await this.fetchCompanyReportData(this.companyReportId);
    await this.getFinanceData(); // 컴포넌트 생성 시 데이터 가져오기
    await this.getCompanyInfo();
    await this.getCompanySummary();
    this.createChart(); // 데이터 가져온 후 차트 생성
  },
  watch: {
    "$route.params.companyReportId": {
      handler(newCompanyReportId) {
        this.fetchCompanyReportData(newCompanyReportId);
      },
      immediate: true,
    },
  },
  mounted(){
    const adminToken = sessionStorage.getItem("adminToken")
    if (adminToken){
      this.$store.state.authenticationModule.isKakaoAdmin = true
        this.$store.state.googleAuthenticationModule.isGoogleAdmin = true
        this.$store.state.naverAuthenticationModule.isNaverAdmin = true
        this.$store.state.accountModule.isNormalAdmin = true
    }
  }
};
</script>

<style scoped>
svg {
  font-family: sans-serif;
}
.custom-img {
  max-width: 100%;
  height: auto;
}

.companyReport-name {
  font-size: 40px;
  font-weight: bold;
  margin: 0;
}

.companyReport-writer {
  font-size: 16px;
  color: grey;
  margin-top: 0;
}

.companyReport-price {
  font-size: 24px;
  color: red;
}

.original-price {
  font-size: 18px;
  color: grey;
  text-decoration: line-through;
  margin-left: 10px;
}

.action-button {
  font-weight: bold;
}

.no-underline {
  text-decoration: none;
}

.currency {
  font-size: 14px;
  vertical-align: baseline;
  margin-left: 3px;
}
.category-text {
  color: rgb(183, 100, 93);
  font-size: 18px; /* 원하는 크기로 조정 */
}
/* From Uiverse.io by Tsiangana */ 
.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background: rgb(255, 135, 65);
  background: linear-gradient(
    250deg,
    rgba(255, 135, 65, 1) 15%,
    rgba(255, 65, 65, 1) 65%
  );
}

/* plus sign */
.sign {
  width: 100%;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign svg {
  width: 17px;
}

.sign svg path {
  fill: white;
}
/* text */
.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: 0.3s;
}
/* hover effect on button width */
.Btn:hover {
  width: 125px;
  border-radius: 40px;
  transition-duration: 0.3s;
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: 0.3s;
  padding-left: 20px;
}
/* hover effect button's text */
.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.3s;
  padding-right: 10px;
}
/* button click effect*/
.Btn:active {
  transform: translate(2px, 2px);
}
/* From Uiverse.io by PriyanshuGupta28 */ 
.pushable {
  position: relative;
  background: transparent;
  padding: 0px;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  outline-color: deeppink;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(226, 25%, 69%);
  border-radius: 8px;
  filter: blur(2px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.edge {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(
    to right,
    hsl(248, 39%, 39%) 0%,
    hsl(248, 39%, 49%) 8%,
    hsl(248, 39%, 39%) 92%,
    hsl(248, 39%, 29%) 100%
  );
}

.front {
  display: block;
  position: relative;
  border-radius: 8px;
  background: hsl(248, 53%, 58%);
  padding: 16px 32px;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 1rem;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover {
  filter: brightness(110%);
}

.pushable:hover .front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

.pushable:hover .shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

.pushable:focus:not(:focus-visible) {
  outline: none;
}
</style>
