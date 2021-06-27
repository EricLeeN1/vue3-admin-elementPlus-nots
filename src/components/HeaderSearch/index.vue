<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'

import { reactive, computed, toRefs, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'HeaderSearch',
  setup() {
    const state = reactive({
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    })
    const headerSearchSelect = ref(null)
    const router = useRouter()
    const store = useStore()
    const routes = computed(() => store.getters.permission_routes)
    const click = () => {
      state.show = !state.show
      if (state.show) {
        // eslint-disable-next-line no-unused-expressions
        headerSearchSelect.value && headerSearchSelect.value.focus()
      }
    }
    const close = () => {
      // eslint-disable-next-line no-unused-expressions
      headerSearchSelect.value && headerSearchSelect.value.blur()
      state.options = []
      state.show = false
    }
    const change = (val) => {
      router.push(val.path)
      state.search = ''
      state.options = []
      nextTick(() => {
        state.show = false
      })
    }
    const initFuse = (list) => {
      state.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    }
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    // eslint-disable-next-line no-shadow
    const generateRoutes = (routes, basePath = '/', prefixTitle = []) => {
      let res = []

      for (let index = 0; index < routes.length; index += 1) {
        // eslint-disable-next-line no-shadow
        const router = routes[index]

        // skip hidden router
        if (!router.hidden) {
          const data = {
            path: path.resolve(basePath, router.path),
            title: [...prefixTitle]
          }

          if (router.meta && router.meta.title) {
            data.title = [...data.title, router.meta.title]

            if (router.redirect !== 'noRedirect') {
              // only push the routes with title
              // special case: need to exclude parent router without redirect
              res.push(data)
            }
          }

          // recursive child routes
          if (router.children) {
            const tempRoutes = generateRoutes(router.children, data.path, data.title)
            if (tempRoutes.length >= 1) {
              res = [...res, ...tempRoutes]
            }
          }
        }
      }
      return res
    }
    const querySearch = (query) => {
      if (query !== '') {
        state.options = state.fuse.search(query)
      } else {
        state.options = []
      }
    }
    return {
      ...toRefs(state),
      headerSearchSelect,
      routes,
      click,
      close,
      change,
      initFuse,
      generateRoutes,
      querySearch
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
