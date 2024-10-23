import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  pages: false, // Nuxt의 페이지 자동 라우팅을 비활성화
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends:[
    './home/nuxt.config.ts',
    './navigationBar/nuxt.config.ts'
  ],
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
    transpile: ['vuetify'] // Vuetify를 빌드 시 트랜스파일링
  },

  vite: {
    ssr: {
      noExternal: ['vuetify'] // SSR에서도 Vuetify를 외부 패키지로 처리하지 않도록 설정
    }
  },

  modules: ['vuetify-nuxt-module',
    '@pinia/nuxt',
    '~/home/index.ts',
  ],
  imports: {
    dirs: ['./stores']
  },

  runtimeConfig: {
    public: {
      MAIN_API_URL: process.env.VUE_APP_BASE_URL,
      AI_BASE_URL: process.env.VUE_APP_AI_BASE_URL,
      AWS_REGION: process.env.VUE_APP_AWS_REGION,
      AWS_S3_IDENTITY_POOL: process.env.VUE_APP_AWS_S3_IDENTITY_POOL_ID,
      VUE_APP_AWS_S3_BUCKET_NAME:process.env.VUE_APP_AWS_S3_BUCKET_NAME,
    }
  },

  // 앱의 메타 태그 및 favicon 설정 추가
  app: {
    head: {
      title: 'AIM', // 기본 페이지 제목
      meta: [
        { charset: 'utf-8' }, // 페이지 인코딩 설정
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // 뷰포트 설정
        { name: 'description', content: 'AIM: AI company-report Insight Market' }, // 페이지 설명
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' } // favicon 설정
      ]
    }
  }
})