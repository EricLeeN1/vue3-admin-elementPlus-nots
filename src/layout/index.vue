<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- <sidebar class="sidebar-container" /> -->
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel/index.vue'
import { useStore } from 'vuex'
import { Navbar, Settings, AppMain } from './components'
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings
    // Sidebar,
    // TagsView
  },
  setup() {
    const store = useStore()
    const sidebar = (state) => state.app.sidebar
    const device = (state) => state.app.device
    const showSettings = (state) => state.settings.showSettings
    const needTagsView = (state) => state.settings.tagsView
    const fixedHeader = (state) => state.settings.fixedHeader
    const handleClickOutside = () => {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
    const classObj = () => {
      return {
        hideSidebar: sidebar.opened,
        openSidebar: sidebar.opened,
        withoutAnimation: sidebar.withoutAnimation,
        mobile: device === 'mobile'
      }
    }
    return {
      sidebar,
      device,
      showSettings,
      needTagsView,
      fixedHeader,
      classObj,
      handleClickOutside
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
