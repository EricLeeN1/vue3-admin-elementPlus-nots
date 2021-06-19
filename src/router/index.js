import { createRouter, createWebHistory } from 'vue-router'
// import Vuex from '@/views/vuex.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index.vue') // 懒加载组件
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
