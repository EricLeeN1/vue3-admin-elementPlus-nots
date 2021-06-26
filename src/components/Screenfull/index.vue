<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
import { reactive, onMounted, toRefs, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Screenfull',
  setup() {
    const state = reactive({
      isFullscreen: false
    })
    // eslint-disable-next-line consistent-return
    const click = () => {
      if (!screenfull.enabled) {
        ElMessage({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
    const change = () => {
      state.isFullscreen = screenfull.isFullscreen
    }
    const init = () => {
      if (screenfull.enabled) {
        screenfull.on('change', change)
      }
    }
    const destroy = () => {
      if (screenfull.enabled) {
        screenfull.off('change', change)
      }
    }
    onMounted(() => {
      init()
    })
    onUnmounted(() => {
      destroy()
    })
    return {
      ...toRefs(state),
      click,
      change,
      init,
      destroy
    }
  }
}
</script>

<style lang="scss" scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
