const defaultState = {
  logs: []
}

export default {
  namespaced: true,
  state() {
    return defaultState
  },
  mutations: {
    ADD_ERROR_LOG: (state, log) => {
      state.logs.push(log)
    },
    CLEAR_ERROR_LOG: (state) => {
      state.logs.splice(0)
    }
  },
  actions: {
    addErrorLog({ commit }, log) {
      commit('ADD_ERROR_LOG', log)
    },
    clearErrorLog({ commit }) {
      commit('CLEAR_ERROR_LOG')
    }
  }
}
