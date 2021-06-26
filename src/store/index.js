import { createStore, createLogger } from 'vuex'
import getters from './getters'
import user from './modules/user'
import settings from './modules/settings'
import tagsView from './modules/tagsView'

const production = import.meta.env.PROD

export default createStore({
  modules: {
    user,
    settings,
    tagsView
  },
  getters,
  plugins: production ? [createLogger()] : []
})
