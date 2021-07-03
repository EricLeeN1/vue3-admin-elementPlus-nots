<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
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
import { computed, watch, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { Navbar, Settings, AppMain, Sidebar, TagsView } from './components'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sidebar = computed(() => store.state.app.sidebar)
    const device = computed(() => store.state.app.device)
    const showSettings = computed(() => store.state.settings.showSettings)
    const needTagsView = computed(() => store.state.settings.tagsView)
    const fixedHeader = computed(() => store.state.settings.fixedHeader)
    const handleClickOutside = (bol = false) => {
      store.dispatch('app/closeSideBar', { withoutAnimation: bol })
    }
    const classObj = computed(() => {
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })
    const isMobile = () => {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    }
    const resizeHandler = () => {
      if (!document.hidden) {
        const isMob = isMobile()
        store.dispatch('app/toggleDevice', isMob ? 'mobile' : 'desktop')

        if (isMob) {
          handleClickOutside(true)
        }
      }
    }
    watch(
      () => route,
      () => {
        if (device.value === 'mobile' && sidebar.value.opened) {
          handleClickOutside(true)
        }
      }
    )
    onBeforeMount(() => {
      window.addEventListener('resize', resizeHandler)
    })
    onMounted(() => {})
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })
    return {
      sidebar,
      device,
      showSettings,
      needTagsView,
      fixedHeader,
      classObj,
      handleClickOutside,
      resizeHandler,
      isMobile
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
