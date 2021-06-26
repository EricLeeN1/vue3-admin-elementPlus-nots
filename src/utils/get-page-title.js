import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vite + Vue3 + Axios + Vue-router + Vuex'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
