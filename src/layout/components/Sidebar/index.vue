<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permissionRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import variable from '@/styles/variables.scss'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  setup() {
    const route = useRoute()
    const store = useStore()
    const sidebar = computed(() => store.getters.sidebar)
    const permissionRoutes = computed(() => store.getters.permission_routes)
    const showLogo = computed(() => store.state.settings.sidebarLogo)
    const isCollapse = computed(() => !sidebar.opened)
    const variables = computed(() => variable)
    const activeMenu = computed(() => {
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    return {
      activeMenu,
      sidebar,
      permissionRoutes,
      showLogo,
      isCollapse,
      variables
    }
  }
}
</script>

<style lang="scss" scoped></style>
