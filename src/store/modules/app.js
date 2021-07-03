/* eslint-disable no-param-reassign */
import { getStore, setStore } from '@/utils/storage'

const defaultState = {
  sidebar: {
    opened: getStore({
      name: 'sidebarStatus'
    })
      ? !!+getStore({
          name: 'sidebarStatus'
        })
      : true,
    withoutAnimation: true
  },
  device: 'desktop',
  size:
    getStore({
      name: 'size'
    }) || 'medium'
}

export default {
  namespaced: true,
  state() {
    return defaultState
  },
  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        setStore({
          name: 'sidebarStatus',
          content: 1
        })
      } else {
        setStore({
          name: 'sidebarStatus',
          content: 0
        })
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      setStore({
        name: 'sidebarStatus',
        content: 0
      })
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
      setStore({
        name: 'size',
        content: size
      })
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}
