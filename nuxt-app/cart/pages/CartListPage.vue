<template>
  <div class="background-image">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              내 장바구니<v-icon left>mdi-basket</v-icon><br />
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr class="table-header">
                    <th>선택</th>
                    <th></th>
                    <th>기업명</th>
                    <th>가격</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItems" :key="item.cartItemId">
                    <td>
                      <v-checkbox
                        v-model="selectedItems"
                        :value="item"
                      ></v-checkbox>
                    </td>
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
                    <td>
                      <v-btn color="red" @click="removeItem(item)">제거</v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-divider></v-divider>
              <v-row>
                <!-- <v-col>
                                  <v-btn color="primary" @click="confirmCheckout" :disabled="isCheckoutDisabled">구매하기</v-btn>
                              </v-col> -->
                <v-col class="text-right">
                  <strong>Total: {{ selectedItemsTotal }}</strong>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
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
            <v-btn color="blue darken-1" text @click="proceedToOrder"
              >확인</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row justify="end">
        <!-- class="d-flex justify-end" -->
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="confirmCheckout"
            :disabled="isCheckoutDisabled"
          >
            <v-icon>mdi-cart</v-icon>
            <span>구매하기</span>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="goToLastPage">
            <v-icon left>mdi-arrow-left</v-icon>
            <span>돌아가기</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "../../cart/stores/cartStore";
import { useOrderStore } from '../../order/stores/orderStore';
// import { useUserLogStore } from '@/stores/userLogStore';
import { useRouter } from "vue-router";

const cartItems = ref([]);
const selectedItems = ref([]);
const isCheckoutDialogVisible = ref(false);
const purchase = ref(true);

const cartStore = useCartStore();
const orderStore = useOrderStore();
// const userLogStore = useUserLogStore();
const router = useRouter();

const cartTotal = computed(() => {
  if (!Array.isArray(cartItems.value) || cartItems.value.length === 0) {
    return 0;
  }
  return cartItems.value.reduce(
    (total, item) => total + item.companyReportPrice * item.quantity,
    0
  );
});

const selectedItemsTotal = computed(() => {
  if (!Array.isArray(selectedItems.value) || selectedItems.value.length === 0) {
    return 0;
  }
  return selectedItems.value.reduce(
    (total, item) => total + item.companyReportPrice * item.quantity,
    0
  );
});

const isCheckoutDisabled = computed(() => selectedItems.value.length === 0);

function getImageUrl(imageName) {
  if (!imageName) {
    // companyReportTitleImage가 null이거나 undefined인 경우 기본 이미지를 반환
    return new URL("/assets/images/fixed/AIM_BI_Blue.png", import.meta.url)
      .href;
  }
  return new URL(`/assets/images/uploadImages/${imageName}`, import.meta.url)
    .href;
}

async function removeItem(item) {
  try {
    await cartStore.requestDeleteCartItemToDjango({
      CartItemId: [item.cartItemId],
    });
    cartItems.value = cartItems.value.filter(
      (cartItem) => cartItem.cartItemId !== item.cartItemId
    );
    selectedItems.value = selectedItems.value.filter(
      (selectedItem) => selectedItem.cartItemId !== item.cartItemId
    );
  } catch (error) {
    // console.error("장바구니 상품 삭제 중 에러 발생:", error);
  }
}

function confirmCheckout() {
  isCheckoutDialogVisible.value = true;
}

async function proceedToOrder() {
  isCheckoutDialogVisible.value = false;
  try {
    const selectedCartItems = cartItems.value.filter((item) =>
      selectedItems.value.includes(item)
    );
    console.log("dddd", cartItems.value)
    const orderItems = selectedCartItems.map((item) => ({
      cartItemId: item.cartItemId,
      orderPrice: item.companyReportPrice,
    }));
    const orderedCartItemIdList = selectedCartItems.map(
      (item) => item.cartItemId
    );

    const response = await orderStore.requestCartToAddOrderToDjango({
      items: orderItems,
    });

    const cartList = await cartStore.requestCartListToDjango();
    await userLogStore.requestCountClickToDjango({
      companyReport_id: cartList[0].companyReportId,
      purchase: purchase.value,
    });

    const orderId = response.orderId;
    await cartStore.requestDeleteCartItemToDjango({
      CartItemId: orderedCartItemIdList,
    });

    window.location.reload(true);
  } catch (error) {
    console.error("Order creation failed:", error);
  }
}

async function fetchCartList() {
  try {
    const email = sessionStorage.getItem('email')
    const response = await cartStore.requestCartListToDjango(email);
    cartItems.value = response;
  } catch (error) {
    console.error("Error fetching cart list:", error);
  }
}

function goToLastPage() {
  router.go('/');
}

onMounted(async () => {
  await fetchCartList();
});
</script>

<style scoped>
.background-image {
  margin-top: 100px;
}

.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.table-header th {
  font-size: 1.3em;
  /* Increase the font size */
  font-weight: 900;
  /* Make the font bold */
}

.companyReport-image {
  max-width: 50px;
  /* 이미지의 최대 너비 */
  max-height: 50px;
  /* 이미지의 최대 높이 */
  object-fit: contain;
  /* 이미지의 비율을 유지하면서 컨테이너에 맞춤 */
}
</style>
