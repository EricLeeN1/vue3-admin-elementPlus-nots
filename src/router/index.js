import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  }
  // {
  //   path: '/vuex',
  //   name: 'Vuex',
  //   component: Vuex
  // },
  // {
  //   path: '/axios',
  //   name: 'Axios',
  //   component: () => import('@/views/axios.vue') // 懒加载组件
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
