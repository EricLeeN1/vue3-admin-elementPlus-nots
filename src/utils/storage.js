import { validateNull } from '@/utils/validate'
import website from '@/config/website'

const keyName = `${website.key}-`
/**
 * 存储localStorage
 */
export const setStore = (params = {}) => {
  const { content, type } = params
  let { name } = params
  name = keyName + name
  const obj = {
    dataType: typeof content,
    content,
    type,
    datetime: new Date().getTime()
  }
  const finall = JSON.stringify(obj)
  if (type) window.sessionStorage.setItem(name, finall)
  else window.localStorage.setItem(name, finall)
}
/**
 * 获取localStorage
 */

export const getStore = (params = {}) => {
  let { name } = params
  name = keyName + name
  let obj = {}
  let content = ''
  obj = window.sessionStorage.getItem(name)
  if (validateNull(obj)) obj = window.localStorage.getItem(name)
  if (validateNull(obj)) return
  try {
    obj = JSON.parse(obj)
  } catch {
    // return obj
  }
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = obj.content
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  // eslint-disable-next-line consistent-return
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = (params = {}) => {
  const { type } = params
  let { name } = params
  name = keyName + name
  if (type) {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

/**
 * 获取全部localStorage
 */
export const getAllStore = (params = {}) => {
  const list = []
  const { type } = params
  if (type) {
    for (let i = 0; i <= window.sessionStorage.length; i += 1) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore({
          name: window.sessionStorage.key(i),
          type: 'session'
        })
      })
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i += 1) {
      list.push({
        name: window.localStorage.key(i),
        content: getStore({
          name: window.localStorage.key(i)
        })
      })
    }
  }
  return list
}

/**
 * 清空全部localStorage
 */
export const clearStore = (params = {}) => {
  const { type } = params
  if (type) {
    window.sessionStorage.clear()
  } else {
    window.localStorage.clear()
  }
}
