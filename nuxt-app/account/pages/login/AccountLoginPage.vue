<template>
  <v-container class="container">
      <div class="login-wrapper">
          <div>
               
              <div class="login_logo">
                  <!-- LOGIN 텍스트 대신 이미지 삽입 -->    
              </div>

              <div v-if="login_flag == false && this.isEmailCollect == false" class="login-error-box">
                  이메일이 올바르지 않습니다.
                  <br />
                  올바른 이메일을 입력하거나,
                  <br />
                  다른 간편로그인을 시도해 보세요.
              </div>
              <div v-if="login_flag == false && this.isEmailCollect == true && this.isPasswordCollect == false" class="login-error-box">
                  비밀번호가 올바르지 않습니다.
                  <br />
                  올바른 비밀번호를 입력하거나,
                  <br />
                  다른 간편로그인을 시도해 보세요.
              </div>

              <v-responsive class="mx-auto" min-width="300">
                  <v-form v-model="form" @submit.prevent="onSubmit">
                      <!-- <v-text-field
                          label="이메일 주소"
                          variant="solo"
                          v-model="email"
                          color="#fff"
                          bg-color="rgba(0, 0, 0, 0.5)"
                          clearable
                          :rules="[emailRequired]"
                          style="width: 75%; margin: 10px auto; display: block;"
                      />

                      <v-text-field
                          label="비밀번호"
                          variant="solo"
                          v-model="password"
                          color="#fff"
                          bg-color="rgba(0, 0, 0, 0.5)"
                          :rules="[passwordRequired]"
                          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="visible ? 'text' : 'password'"
                          @click:append-inner="visible = !visible"
                          style="width: 75%; margin: 10px auto; display: block;"
                      /> -->

                      <!-- 로그인 버튼 -->
                      <!-- <v-btn
                          color="white"
                          :loading="loading"
                          type="submit"
                          variant="elevated"
                          style="width: 75%; margin: 5px auto; display: block; font-size: 12px;"
                      >
                          <b>로그인</b>
                      </v-btn> -->
                  </v-form>
              </v-responsive>

              <!-- 회원가입 버튼 -->
              <!-- <v-btn
                  color="purple darken-2"
                  class="black--text mt-2"
                  style="width: 75%; margin: 5px auto; display: flex; align-items: center; justify-content: center; font-size: 12px;"
                  :to="{ name: 'NomalAccountRegisterPage' }"
              >
                  <b>회원가입</b>
              </v-btn> -->

              <!-- 영역 구분선 -->
              <!-- <v-divider :thickness="3" style="margin-top: 20px; margin-bottom: 20px;"></v-divider> -->

              <!-- 각 소셜 로그인 버튼들 -->
              <v-btn class="kakao-login-btn" @click="goToKakaoLogin">
                  <!-- 카카오 로그인 -->
              </v-btn>

              <v-btn class="google-login-btn" @click="goToGoogleLogin">
                  <!-- Google 로그인 -->
              </v-btn>

              <v-btn class="naver-login-btn" @click="goToNaverLogin">
                  <!-- 네이버 로그인 -->
              </v-btn>
          </div>
      </div>
  </v-container>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/accountStore';
import { useAuthenticationStore } from '../../../authentication/stores/authenticationStore'; 
import { useNaverAuthenticationStore } from '../../../naverAuthentication/stores/naverAuthenticationStore';
// import { useGoogleAuthenticationStore } from '../../../googleAuthentication/stores/googleAuthenticationstore';

// import { useSessionStorage } from '@vueuse/core'; // 세션 스토리지 관리를 위해 VueUse 사용

const router = useRouter();

const form = ref(false);
const email = ref(null);
const password = ref(null);
const visible = ref(false);
const loading = ref(false);
const login_flag = ref(true);
const isEmailCollect = ref(false);
const isPasswordCollect = ref(false);

// Pinia store 상태
const account = useAccountStore();
const authentication = useAuthenticationStore();
// const googleAuthentication = useGoogleAuthenticationStore();
const naverAuthentication = useNaverAuthenticationStore();

// Google, Kakao, Naver 로그인 함수들
const goToKakaoLogin = async () => {
  sessionStorage.setItem("loginType", "KAKAO");
  await authentication.requestKakaoOauthRedirectionToDjango();
};

const goToGoogleLogin = async () => {
  // alert("현재 로그인 검수 중입니다.");
  sessionStorage.setItem("loginType", "GOOGLE");
  await googleAuthentication.requestGoogleOauthRedirectionToDjango();
};

const goToNaverLogin = async () => {
  // alert("현재 로그인 검수 중입니다.");
  sessionStorage.setItem('loginType', "NAVER");
  await naverAuthentication.requestNaverOauthRedirectionToDjango();
};

// Computed properties (Pinia 상태에 기반한 계산된 속성)
const isAuthenticatedKakao = computed(() => authentication.isAuthenticatedKakao);
const isAuthenticatedNormal = computed(() => account.isAuthenticatedNormal);
const loginType = computed(() => account.loginType);
const isKakaoAdmin = computed(() => account.isKakaoAdmin);
// const isAuthenticatedGoogle = computed(() => googleAuthentication.isAuthenticatedGoogle);
const isAuthenticatedNaver = computed(() => naverAuthentication.isAuthenticatedNaver);

// Methods
const goToHome = () => {
  router.push("/");
};

const goToSignUp = () => {
  router.push("/account/register/normal");
};

const onSubmit = async () => {
  if (!form.value) return;
  loading.value = true;

  try {
    const response = await checkPassword();
    const roleType = await account.requestRoleTypeToDjango(email.value);
    
    if (response) {
      login_flag.value = true; // 로그인 성공
      sessionStorage.setItem('email', email.value);
      sessionStorage.setItem('loginType', 'NORMAL');

      if (roleType.data.roleType === "ADMIN") {
        // Admin 처리
        sessionStorage.removeItem('normalToken');
        sessionStorage.setItem('adminToken', true);
        account.REQUEST_IS_ADMIN_TO_DJANGO(true);
        goToHome();
      } else {
        // Normal 처리
        sessionStorage.setItem('normalToken', true);
        account.isAuthenticatedNormal = true;
        goToHome();
      }
    } else {
      login_flag.value = false; // 로그인 실패
    }
  } catch (error) {
    console.error("로그인 중 에러 발생: ", error);
    login_flag.value = false;
  } finally {
    loading.value = false;
  }
};

// Email, Password validation
const emailRequired = v => !!v || "정확한 이메일 주소를 입력하세요.";
const passwordRequired = v => !!v || "비밀번호는 8~20자 사이여야 합니다.";

// 비밀번호 확인 함수
const checkPassword = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    const response = await account.requestAccountCheckToDjango(payload);
    return response;
  } catch (error) {
    console.error("비밀번호 확인 중 에러 발생: ", error);
  }
};

</script>

<style scoped>
.container {   
    max-width: 100vw;
    height: 100vh;    
    display: flex;                  
    justify-content: center;        
    align-items: center;            
    box-sizing: border-box;        
    background-color: white;      
    background: url("@/assets/images/fixed/login_bg.png") no-repeat center center;
    background-size: cover;                                                    
}

.login_logo {
    height: 20vh;
    margin-bottom: 60px;
    overflow: hidden;
    background-image: url("@/assets/images/fixed/AIM_BI_White.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;    
}

/* 로그인 박스 설정 */
.login-wrapper {
    position: relative;
    z-index: 1;   
    width: 520px;
    height: 576px;   
    background-color: rgba(255, 255, 255, 0.08);     
    border: 1px solid rgba(128, 128, 128, 0.8);
    border-radius: 40px;    
    padding: 70px 60px;    
}

/* 에러 메시지 박스 설정 */
.login-error-box {
    background-color: rgb(255, 0, 0);
    padding: 10px;
    margin-bottom: 1px;
    border-radius: 20px;
    color: #fff;
}

/* 로그인 및 회원가입 버튼 설정 */
.v-btn {
    width: 100%;
    height: 48px; 
    margin: 10px auto;
    display: flex;
    align-items: center;  
    justify-content: center;  
}


/* Kakao 로그인 버튼 설정 */
.kakao-login-btn {
    background-image: url("@/assets/images/fixed/btn_login_kakao.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;   
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#FFEA00;
    margin-bottom: 12px;
    border-radius: 10px;
}

/* Google 로그인 버튼 설정 */
.google-login-btn {
    background-image: url("@/assets/images/fixed/btn_login_google.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;       
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    margin-bottom: 12px;
    border-radius: 10px;
}
.naver-login-btn {
    background-image: url("@/assets/images/fixed/btn_login_naver.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;      
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #03C75A;
    border-radius: 10px;
}

.v-text-field input {
    background-color: transparent !important;
    color: black !important; /* 입력값을 검정색으로 설정 */
}

.v-label {
    color: black !important; /* 레이블을 검정색으로 설정 */
}


/* 로그인 폼의 텍스트 필드 라벨 색상 설정 */
:deep(.v-label.v-field-label) {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* 로그인 폼의 텍스트 필드 입력값 색상 설정 */
:deep(.v-text-field input) {
    color: #fff;
}

/* 눈 아이콘 색상 설정 */
:deep(.mdi-eye::before), :deep(.mdi-eye-off::before) {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* 오류 메시지 스타일링 */
:deep(.v-messages__message) {
    color: rgb(0, 0, 255)!important; /* 메시지 색상 */
    font-size: 12px; /* 메시지 폰트 크기 */
}

/* 텍스트 필드 에러 상태의 레이블 색상을 초록색으로 변경 */
:deep(.v-field--error:not(.v-field--disabled) .v-label.v-field-label) {
    color: rgba(0, 0, 255) !important; /* 에러 상태의 레이블 색상을 초록색으로 변경 */
}

</style>