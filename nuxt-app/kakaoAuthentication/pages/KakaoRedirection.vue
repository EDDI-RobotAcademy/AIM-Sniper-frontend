<template>
    <div></div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { kakaoAuthenticationState } from '../stores/kakaoAuthenticationState';

// Vue Router
const router = useRouter();
const route = useRoute();

// Vuex Store
const store = useStore();

// loginType을 가져오는 computed 속성
const loginType = computed(() => store.state.accountModule.loginType);

// 액션과 뮤테이션을 호출하는 메서드
const requestAccessTokenToDjangoRedirection = store.dispatch.bind(
  store,
  'authenticationModule/requestAccessTokenToDjangoRedirection'
);
const requestUserInfoToDjango = store.dispatch.bind(
  store,
  'authenticationModule/requestUserInfoToDjango'
);
const requestAddRedisAccessTokenToDjango = store.dispatch.bind(
  store,
  'authenticationModule/requestAddRedisAccessTokenToDjango'
);
const requestEmailDuplicationCheckToDjango = store.dispatch.bind(
  store,
  'accountModule/requestEmailDuplicationCheckToDjango'
);
const requestRoleTypeToDjango = store.dispatch.bind(
  store,
  'accountModule/requestRoleTypeToDjango'
);

const REQUEST_IS_AUTHENTICATED_TO_DJANGO = store.commit.bind(
  store,
  'authenticationModule/REQUEST_IS_AUTHENTICATED_TO_DJANGO'
);
const REQUEST_IS_ADMIN_TO_DJANGO = store.commit.bind(
  store,
  'authenticationModule/REQUEST_IS_ADMIN_TO_DJANGO'
);

// 리다이렉트 데이터 설정 함수
const setRedirectData = async () => {
  const code = route.query.code;
  await requestAccessTokenToDjangoRedirection({ code });
  
  const userInfo = await requestUserInfoToDjango();
  const email = userInfo.kakao_account.email;

  const isEmailDuplication = await requestEmailDuplicationCheckToDjango({ email });
  if (isEmailDuplication === true) {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      await requestAddRedisAccessTokenToDjango({ email, accessToken });
    } else {
      console.error('AccessToken is missing');
    }

    const roleType = await requestRoleTypeToDjango(email);
    if (roleType.data.roleType === "ADMIN") {
      sessionStorage.setItem('adminToken', sessionStorage.getItem('userToken'));
      sessionStorage.removeItem('userToken');
      REQUEST_IS_AUTHENTICATED_TO_DJANGO(false);
      REQUEST_IS_ADMIN_TO_DJANGO(true);
    }

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('loginType', 'KAKAO');
    router.push('/');
  } else {
    router.push('/account/register');
  }
};

// 컴포넌트가 마운트될 때 실행되는 로직
onMounted(async () => {
  await setRedirectData();
});
</script>
