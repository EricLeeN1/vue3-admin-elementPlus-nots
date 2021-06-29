<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { reactive, computed, toRefs, nextTick, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const internalInstance = getCurrentInstance()
    const state = reactive({
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    })
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const size = computed(() => store.getters.size)

    const refreshView = () => {
      // In order to make the cached page re-rendered
      store.dispatch('tagsView/delAllCachedViews', route)

      const { fullPath } = route

      nextTick(() => {
        router.replace({
          path: `/redirect${fullPath}`
        })
      })
    }
    // eslint-disable-next-line no-shadow
    const handleSetSize = (size) => {
      internalInstance.appContext.config.globalProperties.$ELEMENT.size = size
      store.dispatch('app/setSize', size)
      refreshView()
      ElMessage({
        message: 'Switch Size Success',
        type: 'success'
      })
    }
    return {
      ...toRefs(state),
      size,
      handleSetSize,
      refreshView
    }
  }
}
</script>

<style lang="scss" scoped></style>
