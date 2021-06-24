/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import { debounce } from '@/utils'
import { reactive, onMounted, onUnmounted, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      $_sidebarElm: null,
      $_resizeHandler: null
    })
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    const $_initResizeEvent = () => {
      window.addEventListener('resize', state.$_resizeHandler)
    }
    const $_destroyResizeEvent = () => {
      window.removeEventListener('resize', state.$_resizeHandler)
    }
    const $_sidebarResizeHandler = (e) => {
      if (e.propertyName === 'width') {
        state.$_resizeHandler()
      }
    }
    const $_initSidebarResizeEvent = () => {
      // eslint-disable-next-line prefer-destructuring
      state.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      // eslint-disable-next-line no-unused-expressions
      state.$_sidebarElm &&
        state.$_sidebarElm.addEventListener('transitionend', $_sidebarResizeHandler)
    }
    const $_destroySidebarResizeEvent = () => {
      state.$_sidebarElm &&
        state.$_sidebarElm.removeEventListener('transitionend', state.$_sidebarResizeHandler)
    }
    onMounted(() => {
      state.$_resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      $_initResizeEvent()
      $_initSidebarResizeEvent()
    })
    onUnmounted(() => {
      $_destroyResizeEvent()
      $_destroySidebarResizeEvent()
    })
    return {
      ...toRefs(state),
      $_initResizeEvent,
      $_destroyResizeEvent,
      $_sidebarResizeHandler,
      $_initSidebarResizeEvent,
      $_destroySidebarResizeEvent
    }
  }
}
