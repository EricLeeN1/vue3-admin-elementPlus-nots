// import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

// const datas = import.meta.glob('../../styles/element-variables.scss?url')

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings
const defaultState = {
  theme: '#1890ff',
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo
}

export default {
  namespaced: true,
  state() {
    return defaultState
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
        // eslint-disable-next-line no-param-reassign
        state[key] = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}
