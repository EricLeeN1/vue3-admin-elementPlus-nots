<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    :noresize="true"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, onUnmounted } from 'vue'

const tagAndTagSpacing = 4 // tagAndTagSpacing
export default {
  name: 'ScrollPane',
  emits: ['scroll'],
  // setup(props, { attrs, slots, emit }) {
  setup(props, { emit }) {
    const state = reactive({
      left: 0
    })
    const scrollContainer = ref(null)
    const scrollWrapper = computed(() => scrollContainer.value.$refs)
    const emitScroll = () => {
      emit('scroll')
    }
    const moveToTarget = (currentTag) => {
      // 所有的组件都有一个属性$el:用于获取组件中的元素
      const $container = scrollContainer.value.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollWrapper
      const tagList = scrollContainer.value.$parent.$refs.tagRef

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }
    const handleScroll = (e) => {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = scrollWrapper
      $scrollWrapper.scrollLeft += eventDelta / 4
    }
    onMounted(() => {
      try {
        scrollWrapper.addEventListener('scroll', emitScroll, true)
      } catch (error) {
        console.log(error)
      }
    })
    onUnmounted(() => {
      try {
        scrollWrapper.removeEventListener('scroll', emitScroll, true)
      } catch (error) {
        console.log(error)
      }
    })
    return {
      ...toRefs(state),
      scrollContainer,
      scrollWrapper,
      emitScroll,
      moveToTarget,
      handleScroll
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
