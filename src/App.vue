<template>
  <v-app>
    <navigation-menu-bar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavigationMenuBar from './navigationBar/NavigationMenuBar.vue'

export default defineComponent({
  components: { NavigationMenuBar },
  name: 'App',
})
</script>

<style>
#app {    
  width : 100vw;
  height : 100vh;
}

/* Reset 기본 적용 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  /* font-size: 100%; 기본 폰트 크기 */
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden; /* 가로 스크롤 제거 */
}

/* 특정 요소에 폰트 적용을 원하면 추가로 정의할 수 있음
h1, h2, h3, h4, h5, h6, p, b, a {
  font-family: 'Pretendard', sans-serif;
} */

/* 뷰포트에 맞춘 크기 조정 */
/* body {
  font-size: calc(1vw + 1vh + 0.5vmin); 
  line-height: 1.5;
  max-width: 100%;
} */

/* Flexbox 레이아웃 */
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  cursor: pointer;
}

/* 반응형 레이아웃 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  /* 작은 화면일 때 폰트 크기 조정 */
  body {
    font-size: calc(1vw + 1vh + 0.4vmin);
  }
}

@media (max-width: 480px) {
  /* 아주 작은 화면에서는 더 작은 폰트 크기 */
  body {
    font-size: calc(1vw + 1vh + 0.3vmin);
  }

  /* 이미지의 크기를 화면에 맞춤 */
  img {
    width: 100%;
    height: auto;
  }
}

/* 해상도별 추가 대응 */
@media (max-width: 1024px) {
  .container {
    padding: 20px;
  }
}
</style>
