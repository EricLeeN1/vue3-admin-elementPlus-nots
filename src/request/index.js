/* eslint-disable no-param-reassign */
import Axios from 'axios' // 此处引入axios官方文件
import { ElMessage } from 'element-plus'
import { getStore, clearStore } from '@/utils/storage'
import {
  addPendingRequest,
  removePendingRequest
} from '@/request/tools/encapsulationAxios/cancelRepeatRquest'
import { againRequest } from '@/request/tools/encapsulationAxios/requestAgainSend' // 请求重发
import {
  requestInterceptor as cacheReqInterceptor,
  responseInterceptor as cacheResInterceptor
} from '@/request/tools/encapsulationAxios/requestCache'
// 返回结果处理

// cancelRequest: true       // 接口中定义该项则开启取消重复请求功能
// retry: 3, retryDelay: 1000  // retry 请求重试次数，retryDelay 两次重试之间的时间间隔
// cache: true, setExpireTime: 30000  // cache： true 开启当前接口缓存，setExpireTime 当前接口缓存时限

// 自定义约定接口返回{code: xxx, data: xxx, msg:'err message'}
const responseHandle = {
  200: (response) => {
    return response.data
  },
  401: () => {
    ElMessage({
      title: '认证异常',
      message: '登录状态已过期，请重新登录！',
      type: 'error'
    })
    clearStore()
    window.location.href = window.location.origin
  },
  default: (response) => {
    ElMessage({
      title: '操作失败',
      message: response.data.msg,
      type: 'error'
    })
    return Promise.reject(response)
  }
}
// 取消重复请求
// const baseURL = 'https://api.github.com'

const axios = Axios.create({
  baseURL: '',
  timeout: 50000
})

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    // 请求头用于接口token 认证
    const token = getStore({
      name: 'token'
    })
    if (token) {
      config.headers['Blade-Auth'] = token
    }

    // if (
    //   config.method.toLocaleLowerCase() === 'post' ||
    //   config.method.toLocaleLowerCase() === 'put'
    // ) {
    //   // 参数统一处理，请求都使用data传参
    //   config.data = config.data.data
    // } else if (
    //   config.method.toLocaleLowerCase() === 'get' ||
    //   config.method.toLocaleLowerCase() === 'delete'
    // ) {
    //   // 参数统一处理
    //   config.params = config.data
    // } else {
    //   alert(`不允许的请求方法：${config.method}`)
    // }
    config.cancelRequest = true
    config.cache = true
    config.setExpireTime = 30000
    // pendding 中的请求，后续请求不发送（由于存放的peddingMap 的key 和参数有关，所以放在参数处理之后）
    addPendingRequest(config) // 把当前请求信息添加到pendingRequest对象中
    //  请求缓存
    cacheReqInterceptor(config, axios)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  async (response) => {
    // 响应正常时候就从pendingRequest对象中移除请求
    removePendingRequest(response)
    cacheResInterceptor(response)
    return responseHandle[response.status || 'default'](response)
  },
  (error) => {
    // 从pending 列表中移除请求
    removePendingRequest(error.config || {})
    // 需要特殊处理请求被取消的情况
    if (!Axios.isCancel(error)) {
      // 请求重发
      againRequest(error, axios)
    }
    // 请求缓存处理方式
    if (Axios.isCancel(error) && error.message.data && error.message.data.config.cache) {
      return Promise.resolve(error.message.data.data.data) // 返回结果数据
    }
    return Promise.reject(error)
  }
)
export default axios
