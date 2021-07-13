<template>
  <div ref="stickyRef" :style="{ height: height + 'px', zIndex: zIndex }">
    <div
      :class="className"
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position,
        width: width,
        height: height + 'px'
      }"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, onUnmounted, onActivated, getCurrentInstance } from 'vue'

export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { ctx } = getCurrentInstance()
    const stickyRef = ref(null)
    const state = reactive({
      active: false,
      position: '',
      width: undefined,
      height: undefined,
      isSticky: false
    })
    const sticky = () => {
      if (state.active) {
        return
      }
      state.position = 'fixed'
      state.active = true
      state.width += 'px'
      state.isSticky = true
    }
    const reset = () => {
      state.position = ''
      state.width = 'auto'
      state.active = false
      state.isSticky = false
    }
    const handleReset = () => {
      if (!state.active) {
        return
      }
      reset()
    }
    const handleScroll = () => {
      const { width } = ctx.$el.getBoundingClientRect()
      state.width = width || 'auto'
      const offsetTop = ctx.$el.getBoundingClientRect().top
      if (offsetTop < props.stickyTop) {
        sticky()
        return
      }
      handleReset()
    }
    const handleResize = () => {
      if (state.isSticky) {
        state.width = `${ctx.$el.getBoundingClientRect().width}px`
      }
    }
    onMounted(() => {
      state.height = ctx.$el.getBoundingClientRect().height
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    })
    onActivated(() => {
      handleScroll()
    })
    return {
      ...toRefs(state),
      stickyRef,
      sticky,
      handleReset,
      reset,
      handleResize,
      handleScroll
    }
  }
}
</script>

<style lang="scss" scoped></style>
