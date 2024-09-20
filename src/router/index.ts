import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SurveyRoutes from '@/survey/router/SurveyRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'
import AuthenticationRoutes from '@/authentication/router/AuthenticationRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'

const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...AccountRoutes,
  ...AuthenticationRoutes,  
  ...SurveyRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router