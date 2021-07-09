<template>
  <div class="app-container">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
      >Export</el-button
    >

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" align="center">
        <el-table-column label="Name">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Description" min-width="110" align="center">
          <template #default="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column min-width="180px" align="center" label="Language">
          <template #default="scope">
            <span>{{ scope.row.language }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Url" width="220">
        <template #default="scope">
          <span>{{ scope.row.clone_url }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onBeforeMount } from 'vue'
import { transactionList } from '@/apis/github'
import { parseTime } from '@/utils'

// TODO add v-model 父子组件双向绑定处理

export default {
  name: 'MergeHeader',
  setup() {
    const multipleTable = ref(null)
    const state = reactive({
      list: null,
      listLoading: true,
      downloadLoading: false
    })
    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          }
          return v[j]
        })
      )
    }
    const handleDownload = () => {
      state.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [['Id', 'Main Information', 'Language', '', 'Date']]
        const header = ['', 'description', 'language', 'Readings', '']
        const filterVal = ['id', 'name', 'author', 'pageviews', 'display_time']
        const { list } = state
        const data = formatJson(filterVal, list)
        const merges = ['A1:A2', 'B1:D1', 'E1:E2']
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data
        })
        state.downloadLoading = false
      })
    }
    const statusFilter = (status) => {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    const fetchData = async () => {
      state.listLoading = true
      const data = await transactionList()
      state.list = data
      state.listLoading = false
    }
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    onBeforeMount(() => {
      fetchData()
    })
    return {
      multipleTable,
      ...toRefs(state),
      fetchData,
      statusFilter,
      handleDownload,
      formatJson,
      handleSelectionChange
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
