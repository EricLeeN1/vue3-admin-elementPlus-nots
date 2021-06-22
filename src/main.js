import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// 注册icons组件
import SvgIcon from '@/components/SvgIcon'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'normalize.css'
import 'element-plus/lib/theme-chalk/index.css' // svg component

const app = createApp(App)
// import './icons' // icon
app.component(SvgIcon, SvgIcon)
app.use(router).use(store).use(ElementPlus).mount('#app')
