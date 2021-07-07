<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { ref, onBeforeMount, computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import adminDashboard from './admin/index.vue'
import editorDashboard from './editor/index.vue'

export default defineComponent({
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  setup() {
    const store = useStore()
    const currentRole = ref('adminDashboard')
    const roles = computed(() => store.getters.roles)
    onBeforeMount(() => {
      if (!roles.value.includes('admin')) {
        currentRole.value = 'editorDashboard'
      }
    })
    return {
      roles,
      currentRole
    }
  }
})
</script>

<style lang="scss" scoped></style>
