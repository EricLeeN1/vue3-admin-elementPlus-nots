<template>
  <div class="tab-container">
    <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert
      :closable="false"
      style="width: 200px; display: inline-block; vertical-align: middle; margin-left: 30px"
      title="Tab with keep-alive"
      type="success"
    />
    <el-tabs v-model="activeName" style="margin-top: 15px" type="border-card">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane v-if="activeName == item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { reactive, toRefs, watch, onBeforeMount } from 'vue'
import TabPane from './components/TabPane.vue'

export default {
  name: 'Tab',
  components: { TabPane },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      tabMapOptions: [
        { label: 'China', key: 'CN' },
        { label: 'USA', key: 'US' },
        { label: 'Japan', key: 'JP' },
        { label: 'Eurozone', key: 'EU' }
      ],
      activeName: 'CN',
      createdTimes: 0
    })
    const showCreatedTimes = () => {
      state.createdTimes += 1
    }
    onBeforeMount(() => {
      // init the default selected tab
      const { tab } = route.query
      if (tab) {
        state.activeName = tab
      }
    })
    watch(
      () => state.activeName,
      (val) => {
        router.push(`${route.path}?tab=${val}`)
      }
    )
    return {
      ...toRefs(state),
      showCreatedTimes
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-container {
  margin: 30px;
}
</style>
