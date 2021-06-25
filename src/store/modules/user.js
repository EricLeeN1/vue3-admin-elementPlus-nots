/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import { logout, getUserInfos } from '@/apis/github/'
import { getStore, setStore, clearStore } from '@/utils/storage'
import router, { resetRouter } from '@/router'
import { createStore } from 'vuex'

const defaultState = {
  token: getStore({
    name: 'token'
  }),
  introduction: '',
  roles: ['admin'],
  name: 'Dashboard',
  avatar: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
}

export default createStore({
  namespaced: true,
  state() {
    return defaultState
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // user login
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        getUserInfos({ username: username.trim(), password })
          .then((response) => {
            const { data } = response
            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const { roles, name, avatar, introduction } = data
            commit('SET_TOKEN', data.token)
            setStore({
              name: 'token',
              data: data.token
            })
            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject('getUserInfos: roles must be a non-null array!')
            }

            commit('SET_ROLES', roles)
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            commit('SET_INTRODUCTION', introduction)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // user logout
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            clearStore()
            resetRouter()

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })

            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        clearStore()
        resolve()
      })
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
      const token = `${role}-token`

      commit('SET_TOKEN', token)
      setStore({
        name: 'token',
        data: token
      })

      const { roles } = await dispatch('getUserInfos')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })
    }
  }
})
