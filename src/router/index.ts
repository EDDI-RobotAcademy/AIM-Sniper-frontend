import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SurveyRoutes from '@/survey/router/SurveyRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'
import AuthenticationRoutes from '@/authentication/router/AuthenticationRoutes'
import GoogleAuthenticationRoutes from '@/googleAuthentication/router/GoogleAuthenticationRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'
import NaverAuthenticationRoutes from '@/naverAuthentication/router/NaverAuthenticationRoutes'
import ProductRoutes from '@/product/router/ProductRoutes'

const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...AccountRoutes,
  ...AuthenticationRoutes,  
  ...GoogleAuthenticationRoutes, 
  ...NaverAuthenticationRoutes,
  ...SurveyRoutes,
  ...ProductRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router