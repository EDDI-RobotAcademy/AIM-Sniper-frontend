// plugins/vgtag.js
import { defineNuxtPlugin } from '#app'
import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const isDev = process.env.NODE_ENV !== 'production'; // 개발 환경 체크

  if (!isDev) {
    nuxtApp.vueApp.use(VueGtag, {
      property: {
        id: process.env.GA_TRACKING_ID, 
      },
    });
  }
});
