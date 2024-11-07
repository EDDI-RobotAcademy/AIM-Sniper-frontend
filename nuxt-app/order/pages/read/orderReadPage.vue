<template>
    <v-container style="margin-top: 10vh;">
      <v-row>
        <v-col cols="12">
          <h2>구매한 보고서</h2><br>
          <v-card>
            <v-card-text>
              <v-table>
                <thead>
                  <tr class="table-header">
                    <th></th>
                    <th>기업명</th>
                    <th>가격</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in orderItemList"
                    :key="item.companyReportId"
                    @click="goToCompanyReportReadPage(item.companyReportId)"  
                  >
                    <td>
                      <v-img
                        :src="getImageUrl(item.companyReportTitleImage)"
                        aspect-ratio="1"
                        class="companyReport-image"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          ></v-row>
                        </template>
                      </v-img>
                    </td>
                    <td>{{ item.companyReportName }}</td>
                    <td>{{ item.companyReportPrice }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-divider></v-divider>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <br>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn color="primary" @click="goToLastPage">
            <v-icon left>mdi-arrow-left</v-icon>
            <span>돌아가기</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore'; // Pinia store import

// Props 정의
const props = defineProps({
  companyReportId: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const route = useRoute()
const ordersId = ref(route.params.ordersId)
const orderStore = useOrderStore();

// 반응형 변수 설정
const orderItem = ref([]);

// Pinia의 상태 참조
const orderItemList = computed(() => orderStore.orderItemList);

const getDefaultImageUrl = () => {
  try {
    return new URL(`/assets/images/fixed/AIM_BI_Simple_Grey2.png`, import.meta.url).href;
  } catch (error) {
    console.error('Error loading default image:', error);
    return '/assets/images/fixed/AIM_BI_Simple_Grey2.png';
  }
};

const getImageUrl = (imageName) => {
  try {
    if (!imageName || typeof imageName !== 'string') {
      return getDefaultImageUrl();
    }
    
    // 이미지 경로가 유효한지 확인
    const imageUrl = new URL(`/assets/images/uploadImages/${imageName}`, import.meta.url).href;
    if (imageUrl.includes('undefined')) {
      return getDefaultImageUrl();
    }
    return imageUrl;
  } catch (error) {
    console.error('Error loading image:', error);
    return getDefaultImageUrl();
  }
};

function goToCompanyReportReadPage(companyReportId) {
  router.push({
    path: `/companyReport/read/${companyReportId}`,
  })
};

// 마운트 시 데이터 로드
onMounted(async () => {
  const response = await orderStore.requestMyOrderItemListToDjango(ordersId.value);
  orderItem.value = response;
  // console.log(orderItem.value)
});
</script>


<style>
.table-header th {
  font-size: 1.3em; /* Increase the font size */
  font-weight: 900; /* Make the font bold */
}

.companyReport-image {
  max-width: 50px; /* 이미지의 최대 너비 */
  max-height: 50px; /* 이미지의 최대 높이 */
  object-fit: contain; /* 이미지의 비율을 유지하면서 컨테이너에 맞춤 */
}
</style>
  