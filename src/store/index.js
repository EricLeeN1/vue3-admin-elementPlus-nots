import { createStore } from 'vuex'

const defaultState = {
  count: 0,
  roles: ['admin'],
  name: 'Dashboard',
  avatar: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
}

// Create a new store instance.
export default createStore({
  state() {
    return defaultState
  },
  mutations: {
    increment(state) {
      // eslint-disable-next-line no-param-reassign
      state.count += 1
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    }
  },
  getters: {
    roles: (state) => state.roles,
    name: (state) => state.name,
    avatar: (state) => state.avatar,
    double(state) {
      return 2 * state.count
    }
  }
})
