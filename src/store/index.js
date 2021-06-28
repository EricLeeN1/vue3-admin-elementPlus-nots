import { createStore, createLogger } from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import errorLog from './modules/errorLog'

const production = import.meta.env.PROD

export default createStore({
  modules: {
    app,
    user,
    settings,
    tagsView,
    errorLog
  },
  getters,
  plugins: production ? [createLogger()] : []
})
