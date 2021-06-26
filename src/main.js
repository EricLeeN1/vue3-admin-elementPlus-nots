import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import SvgIcon from '@/components/SvgIcon/index.vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'normalize.css/normalize.css'

import './permission'

const app = createApp(App)
// 注册icons组件
// 引入icons组件
app.component('svg-icon', SvgIcon) // svg component
// const svgModules = import.meta.glob('./icons/svg/*.svg')
// console.log(svgModules)
// const requireAll = (requireContext) => {
//   const { entries } = Object

//   for (const [key] of entries(requireContext)) {
//     console.log(key) // ['a', 1], ['b', 2], ['c', 3]
//   }
//   return requireContext
// }
// requireAll(svgModules)
app.use(router).use(store).use(ElementPlus).mount('#app')
