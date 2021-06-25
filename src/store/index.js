import { createStore, createLogger } from 'vuex'
import getters from './getters'
import user from './modules/user'
// import products from './modules/products'

const production = import.meta.env.PROD

export default createStore({
  modules: {
    user
  },
  getters,
  // strict: fa,
  plugins: production ? [createLogger()] : []
})
