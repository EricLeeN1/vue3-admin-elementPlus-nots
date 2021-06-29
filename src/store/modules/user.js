/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
import { logout, getUserInfos } from '@/apis/github/'
import { getStore, setStore, clearStore } from '@/utils/storage'
import router, { resetRouter } from '@/router'

const defaultState = {
  token:
    getStore({
      name: 'token'
    }) || '',
  userInfos:
    getStore({
      name: 'token'
    }) || '',
  roles: getStore({
    name: 'roles'
  }) || ['admin'],
  name:
    getStore({
      name: 'name'
    }) || '',
  avatar:
    getStore({
      name: 'avatar'
    }) || ''
}

export default {
  namespaced: true,
  state() {
    return defaultState
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setStore({
        name: 'token',
        content: token
      })
    },
    SET_USERINFOS: (state, userInfos) => {
      state.userInfos = userInfos
      setStore({
        name: 'userInfos',
        content: userInfos
      })
    },
    SET_NAME: (state, name) => {
      state.name = name
      setStore({
        name: 'name',
        content: name
      })
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      setStore({
        name: 'avatar',
        content: avatar
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setStore({
        name: 'roles',
        content: roles
      })
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

            const { name, avatar_url, node_id } = data
            commit('SET_TOKEN', node_id)
            commit('SET_ROLES', ['admin'])
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar_url)
            commit('SET_USERINFOS', data)

            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfos(state.userInfos)
          .then((response) => {
            const { data } = response

            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const { name, avatar_url, node_id } = data

            commit('SET_TOKEN', node_id)
            commit('SET_ROLES', ['admin'])
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar_url)
            commit('SET_USERINFOS', data)
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
}
