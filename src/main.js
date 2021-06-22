import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'normalize.css'
import 'element-plus/lib/theme-chalk/index.css'
// import './icons' // icon

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')
