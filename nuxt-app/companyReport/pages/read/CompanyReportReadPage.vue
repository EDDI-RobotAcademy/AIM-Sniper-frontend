<template>
  <v-container class="template">   
    <v-card v-if="companyReport">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3" class="d-flex justify-end">
              <v-img
                :src=" getImageUrl(companyReport.companyReportTitleImage)"
                class="custom-img grey lighten-2"
                aspect-ratio="1"
                style="max-width: 150px; height: 150px;"
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
            
            <v-col cols="9" md="6" class="d-flex flex-column justify-center">
              
              <v-row>
                <v-col cols="12" md="5">
                  <!-- 이 상품의 태그 -->
                  <v-row>                    
                    <v-btn
                    v-for="(keyword, index) in companyReport.keyword.split(',')"
                    :key="index"
                    outlined
                    rounded
                    class="keyword-btn"
                    style="pointer-events: none;"
                    >
                    {{ keyword.trim() }}
                    </v-btn>
                    
                  </v-row>
                </v-col>
              </v-row>
              
              <v-row>
                <v-col>
                  <h2> {{ companyInfo.company_name }} 기업 분석 리포트 </h2>
                </v-col>
                
                <v-col cols="3">
                  <p class="companyReport-price">
                    {{ companyReport.companyReportPrice }}
                    <span class="original-price">{{
                      companyReport.originalPrice
                    }}</span>
                    <span class="currency">원</span>
                  </p>
                </v-col>
              </v-row>
                
              <v-row style="margin-bottom: 20px;">                 
                <v-btn v-if="!(isAdmin)"                 
                @click="confirmCheckout"
                class="order-action-button"
                style="margin-right: 10px;"
                >
                  <v-icon v-if="!(isAdmin)" left>mdi-cart</v-icon>
                  구매하기
                </v-btn>

                <v-btn v-if="!(isAdmin)"                 
                @click="isGoToCartListDialogVisible = true"
                class="cart-action-button"
                  >
                  <v-icon left>mdi-cart-plus</v-icon>
                  장바구니 담기
                </v-btn>                
              </v-row>
            </v-col> 
          </v-row>

          <v-divider class="my-4"></v-divider>

          
          <v-row ref="overviewRow" class="overview" justify="center">
            <v-col ref="overviewRef" cols="auto" class="overview-content mb-2 mt-2">
              <v-row no-gutters>
                <v-col cols="auto" class="mb-2">
                  <span>
                    <b>주소</b>  {{ companyInfo.address }}
                  </span>
                </v-col>
                <v-col cols="auto" class="mb-2">
                  <span>
                    <b>대표이사</b>  {{ companyInfo.ceo_name }}
                  </span>
                </v-col>
                <v-col cols="auto" class="mb-2">
                  <span>
                    <b>설립연도</b>  {{ companyInfo.est_date }}
                  </span>
                </v-col>
                <v-col cols="auto">
                  <span>
                    <b>웹사이트  </b>
                    <a :href="'https://' + companyInfo.website" target="_blank" rel="noopener">
                      {{ companyInfo.website }}
                    </a>
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          
          <div :style="{ width: maxWidth + 'px',  margin: '0 auto' }" >
            <v-divider class="my-2"></v-divider>
          </div>

          <v-row class="finance" justify="center">
            <v-col ref="financeRef" cols="auto" class="my-5 d-flex justify-center align-center">
              <div ref="chartRef"></div>
            </v-col>
          </v-row>

          <div class="width-divider my-2" 
                :style="{ width: maxWidth + 'px',  margin: '0 auto' }"
          >
            <v-divider></v-divider>
          </div>

          <v-row 
              :style="{ width: financeWidth + 'px' }"
              class="summary my-5 d-flex justify-center align-center">
            <v-col cols="auto">
              <span v-html="companyInfo.business_summary"></span>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>
    </v-card>

    <v-alert v-else type="info">현재 등록된 상품이 없습니다!</v-alert>
    <v-spacer></v-spacer>
    <v-row justify="center" class="mt-4">
      <v-col cols="auto">
        <!-- <router-link :to="{ name: 'CompanyReportListPage' }" class="router-link no-underline"> -->
          <v-btn class="return-action-button">
            <v-icon left>mdi-arrow-left</v-icon>
            <span>목록으로 돌아가기</span>
          </v-btn>
        <!-- </router-link> -->
      </v-col>

      <button v-if="isAdmin"
        class="Btn"
        @click="deleteCompanyReport">
        <div class="sign">
          <svg
            viewBox="0 0 16 16"
            class="bi bi-trash3-fill"
            fill="currentColor"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"></path>
          </svg>
        </div>
        <div class="text">Delete</div>
      </button>

      <button v-if="isAdmin"
        class="pushable"
        @click="goToModifyPage">
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
          <v-btn color="blue darken-1" text @click="onAddToCartAndAsk">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCompanyReportStore } from "../../stores/companyReportStore";
import * as d3 from 'd3';
import { useAccountStore } from '../../../account/stores/accountStore';
import { useAuthenticationStore } from '../../../authentication/stores/authenticationStore';
import { useNaverAuthenticationStore } from '../../../naverAuthentication/stores/naverAuthenticationStore';
import { useUserLogStore } from '../../../userLog/store/userLogStore';

const route = useRoute();
const router = useRouter();
const companyReportStore = useCompanyReportStore();
const accountStore = useAccountStore();
const authenticationStore = useAuthenticationStore();
const naverAuthenticationStore = useNaverAuthenticationStore();
const userLogStore = useUserLogStore();
// const orderStore = useOrderStore();

const companyReportId = ref(route.params.id);
const isCheckoutDialogVisible = ref(false);
const isGoToCartListDialogVisible = ref(false);
const maxWidth = ref(0);
const financeWidth = ref(0);
const purchase = ref(true);
const financeData = ref([]);
const financeYears = ref([]);
const companyInfo = ref([]);

const chartRef = ref(null);
const overviewRef = ref(null);
const financeRef = ref(null);

const isAdmin = ref(false);
const isAuthenticated = ref(false);

const companyReport = computed(() => companyReportStore.companyReport);
const companyReports = computed(() => companyReportStore.companyReportList);


function checkAdmin() {
  if (authenticationStore.isKakaoAdmin ||
    naverAuthenticationStore.isNaverAdmin ||
    // googleAuthenticationStore.isGoogleAdmin ||
    accountStore.isNormalAdmin) {
      isAdmin.value = true
    }
}

function checkAuthenticated() {
  if (authenticationStore.isAuthenticatedKakao ||
      naverAuthenticationStore.isAuthenticatedNaver ||
      isAdmin.value) {
      isAuthenticated.value = true
      console.log(accountStore.isAuthenticatedNormal)
    }
}

const onPurchase = async () => {
  isCheckoutDialogVisible.value = false
  
  try {
    const email = sessionStorage.getItem("email")
    const payload = {
      email: email,
      companyReportId: companyReportId.value,
    }
    const isDuplicatedOrderItem = await orderStore.requestOrderItemDuplicationCheckToDjango(payload)
    
    if (isDuplicatedOrderItem) {
      alert("이미 구매하신 보고서입니다.")
    } else {
      try {
        const email = sessionStorage.getItem("email")
        const orderPayload = {
          email,
          companyReportId: companyReportId.value,
          companyReportPrice: companyReport.companyReportPrice,
        }
        const response = await orderStore.requestCompanyReportReadToAddOrderToDjango(payload)
        userLogStore.requestCountClickToDjango({
          companyReport_id: companyReport.companyReportId,
          purchase: purchase.value,
        })
        await createStore.requestDeleteCartItemToDjango({
          companyReportId: [companyReport.companyReportId],
        })
        alert("구매가 완료되었습니다.");
      } catch (error) {
            console.log("상품 구매 중 에러 발생:", error);
      }
    }
  } catch (error) {
        console.log("이미 구매한 상품인지 확인 중 에러 발생:", error);
  }
}

const onAddToCartAndAsk = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const payload = {
        email: email,
        companyReportId: companyReport.companyReportId,
    };
    const isDuplicatedOrderItem =
      await orderStore.requestOrderItemDuplicationCheckToDjango(payload);
    const isDuplicatedCartItem =
      await cartStore.requestCartItemDuplicationCheckToDjango(payload);
    if (isDuplicatedOrderItem) {
      alert("이미 구매하신 보고서입니다.");
    } else if (isDuplicatedCartItem) {
      alert("장바구니에 있는 보고서입니다.");
    } else {
      try {
        isGoToCartListDialogVisible.value = true;
        const cartData = {
          companyReportId: companyReport.companyReportId,
          companyReportName: companyReport.companyReportName,
          companyReportPrice: companyReport.companyReportPrice,
        };
        await cartStore.requestAddCartToDjango(cartData);
      } catch (error) {
        console.log("장바구니 추가 과정에서 에러 발생:", error);
      }
    }
  } catch (error) {
    console.log("이미 구매한 상품인지 확인 중 에러 발생:", error);
  }
}

// [TODO] 기능 확인
const checkOrdersItemDuplication = async () => {
  try {
    const isDuplicate =
      await orderStore.requestOrdersItemDuplicationCheckToDjango({
        companyReportId: companyReport.companyReportId,
      });

    if (isDuplicate) {
      ordersItemErrorMessages.value = ["이 nickname은 이미 사용중입니다!"];
      isNicknameValid.value = false;
    } else {
      nicknameErrorMessages.value = [];
      isNicknameValid.value = true;
    }
  } catch (error) {
    alert("닉네임 중복 확인에 실패했습니다!");
    isNicknameValid.value = false;
  }
}

const deleteCompanyReport = async () => {
  await companyReportStore.requestDeleteCompanyReportToDjango(companyReportId.value)
  alert("보고서가 삭제되었습니다.")
  router.push("/companyReport/list")
}


async function fetchCompanyReportData(companyReportId) {
  await companyReportStore.requestCompanyReportToDjango(companyReportId);
};

async function getFinanceData() {
  let data = await companyReportStore.requestCompanyReportFinanceToDjango(companyReport.value.companyReportName);
  financeData.value = data.data;
  financeYears.value = Object.keys(data.data);
};

async function getCompanyInfo() {
  let data = await companyReportStore.requestCompanyReportInfoToDjango(companyReport.value.companyReportName);
  companyInfo.value = data.data[0];
};

const getImageUrl = (imageName) => {
  if (!imageName) {
    return new URL(`/assets/images/fixed/AIM_BI_Simple.png`, import.meta.url)
      .href;
  }
  return new URL(`/assets/images/uploadImages/${imageName}`, import.meta.url)
    .href;
};

function confirmCheckout() {
  isCheckoutDialogVisible.value = true;
}
function goToCartList() {
  router.push(`/cart/list`);
}
function goToModifyPage() {
  router.push(`/companyReport/modify/${companyReport.companyReportId}`);
}

function createChart() {
  if (chartRef.value) {
    const margin = { top: 55, right: 25, bottom: 20, left: 40 };
    const width = 250 - margin.right * 2;
    const height = 260 - margin.top - margin.bottom;
    const years = financeYears.value;

    // 숫자를 한국식으로 변환하는 함수
    function formatKoreanNumber(number) {
      const isNegative = number < 0; // 음수 여부 확인
      number = Math.abs(number); // 절대값으로 변환하여 처리
      
      let result = '';
      
      if (number >= 1e12) {
        const trillion = Math.floor(number / 1e12);
        const billion = Math.round((number % 1e12) / 1e8);
        result = `${trillion}조 ${billion > 0 ? billion + '억' : ''}`;
      } else if (number >= 1e8) {
          result = `${Math.round(number / 1e8)}억`;
        } else if (number >= 1e6) {
          result = `${Math.round(number / 1e6)}백만`;
        } else if (number >= 1e3) {
          result = `${Math.round(number / 1e3)}천`;
        } else {
          result = number.toLocaleString();
        }
        
        return isNegative ? `-${result}` : result; // 음수인 경우 '-' 추가
      }

    // 각 지표에 대한 막대 생성
    const metrics = [
      { key: 'revenue', label: '수익성 (매출액)' },
      { key: 'profit_trend', label: '수익성 (영업이익)' },
      { key: 'owners_capital', label: '안정성 (자기자본)' }
    ];

    metrics.forEach((metric) => {
      const svg = d3.select(chartRef.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // x축
      const x0 = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.2);

      // x축 추가
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .style('color', '#808080');

      // y축
      const yMax = d3.max(years.map(year => financeData.value[year][0][metric.key]));
      const yMin = d3.min(years.map(year => financeData.value[year][0][metric.key]));
      const yMaxAbs = Math.max(Math.abs(yMin), Math.abs(yMax));
      const y = d3.scaleLinear()
        .domain([yMin < 0 ? -yMaxAbs : 0, yMax])
        .range([height, 0]);

      svg.append('g')
        .call(d3.axisLeft(y)
          .ticks(3)
          .tickFormat(d => d.toString().slice(0, 2))
        )
        .style('color', '#808080');

      // 기준선(0) 그리기
      if (yMin < 0) {
        svg.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(0))
          .attr('y2', y(0))
          .attr('stroke', '#808080')
          .attr('stroke-width', 1);
      }

      // 막대 색상 설정
      const getBarColor = (value, preValue) => {
        if (preValue !== undefined) {
            const change = (() => {
                if (preValue > 0) {
                    return ((value - preValue) / preValue) * 100;
                } else if (preValue < 0) {
                    if (value > 0) {
                        return ((value - preValue) / Math.abs(preValue)) * 100;
                    } else {
                        return ((Math.abs(preValue) - Math.abs(value)) / Math.abs(preValue)) * 100;
                    }
                } else {
                    // preValue가 0일 때 처리
                    return value > 0 ? 100 : (value < 0 ? -100 : 0);
                }
            })();
            if (change >= 5) return "#77DD77"; // 초록색 (증가)
            if (change <= -5) return "#FF6961"; // 빨간색 (감소)
            return "#AEC6CF"; // 파란색 (변화 거의 없음)
        }
        return "#D3D3D3"; // 회색 (기본값)
      };

      // 막대 추가
      svg.selectAll(`.${metric.key}`)
          .data(years.map((year, index) => {
              const value = financeData.value[year].length > 0 ? financeData.value[year][0][metric.key] : 0;
              const preValue = index > 0 ? financeData.value[years[index - 1]].length > 0 ? financeData.value[years[index - 1]][0][metric.key] : 0 : undefined;
              return {
                  year,
                  value,
                  color: index === years.length - 1 ? getBarColor(value, preValue) : "#D3D3D3" // 회색 (이전), 조건부 색상 (최신)
              };
          }))
          .enter()
          .append('rect')
          .attr('class', metric.key)
          .attr('x', d => x0(d.year))
          .attr('y', d => d.value >= 0 ? y(d.value) : y(0))
          .attr('width', x0.bandwidth())
          .attr('height', d => Math.abs(y(d.value) - y(0)))  // 양수는 y(0) - y(d.value), 음수는 y(d.value) - y(0)
          .attr('fill', d => d.color);


      // 막대 상단에 값 표시
      svg.selectAll(`.${metric.key}-label`)
          .data(years.map(year => ({
              year: year,
              value: financeData.value[year].length > 0 ? financeData.value[year][0][metric.key] : 0,
          })))
          .enter()
          .append('text')
          .attr('class', `${metric.key}-label`)
          .attr('x', d => x0(d.year) + x0.bandwidth() / 2)
          .attr('y', d => y(d.value) - 7)
          .attr('text-anchor', 'middle')
          .attr('fill', '#6b6b6b')
          .attr('font-size', 10)
          .text(d => formatKoreanNumber(d.value));

      // 제목 추가
      svg.append('text')
          .attr('class', 'chart-title')
          .attr('x', width / 2) // 가운데 정렬
          .attr('y', -40) // Y축 위쪽으로 위치 조정
          .attr('text-anchor', 'middle')
          .attr('font-weight', 'bold')
          .text(metric.label);
    });
  } else {
    console.error('chartRef is not available');
  }
};

const calculateMaxWidth = () => {
  const overviewWidth = overviewRef.value.$el.getBoundingClientRect().width
  const financeWidthLocal = financeRef.value.$el.getBoundingClientRect().width
  
  financeWidth.value = financeWidthLocal;
  maxWidth.value = Math.max(overviewWidth, financeWidthLocal);
};

onMounted(async () => {
  await fetchCompanyReportData(companyReportId.value);
  await getFinanceData();
  await getCompanyInfo();

  createChart();
  
  calculateMaxWidth();
  window.addEventListener('resize', calculateMaxWidth);

  checkAdmin()
  checkAuthenticated()
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateMaxWidth);
});

</script>

<style scoped>
.template {
  margin-top: 100px;
}

svg {
  font-family: sans-serif;
}

.custom-img {
  max-width: 200px;
  height: 200px;
  border: 1px solid #ccc !important;
  border-radius: 32px;
  box-shadow: 0 1px 3px rgb(206, 205, 205);
  margin-bottom: 30px;
}

.keyword-btn {
  border-radius: 8px;
  color: #1e68d1;
  width: auto;
  height: 3vh;
  margin-top: 10px;
  padding: 2px 12px;
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
  font-size: 20px;
  color: grey;
}

.original-price {
  font-size: 18px;
  color: grey;
  text-decoration: line-through;
  margin-left: 10px;
}

.order-action-button {
  width: 130px;
  height: 45px;
  border-radius: 13px;
  background: #0A28B0;
  color: #FFFFFF;
}
.cart-action-button {
  width: 130px;
  height: 45px;
  border-radius: 13px;
  border: 1px solid #E6E8EC !important;
  background: white;
  color: #7B8094;
}
.return-action-button {
  width: 158px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #7B8094 !important;
  background: white;
  color: black;
  margin-bottom: 40px;
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

a {
  color: rgb(107, 107, 107);
  text-decoration: none; 
}

a:hover {
  color: rgb(27, 59, 173);
}

a:visited {
  color: rgb(107, 107, 107); 
}

a:active {
  color: rgb(27, 59, 173); 
}

.overview-content span {
  padding: 2rem;
  color: rgb(107, 107, 107);
}

.overview-content span b {
  font-size: 1.rem;
}

.summary {
  margin: auto;
}

::v-deep .summary p {
  margin-bottom: 30px;
  line-height: 1.8;
}

::v-deep .summary span > ul > li {
  list-style-type: none;
  margin-bottom: 30px;
}

::v-deep .summary li ul {
  padding-left: 20px; 
  margin: 10px 0 10px 10px;
}

</style>