<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default excel-list)"
      style="width: 350px"
      prefix-icon="el-icon-document"
    />
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >
      Export Selected Items
    </el-button>
    <a
      href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html"
      target="_blank"
      style="margin-left: 15px"
    >
      <el-tag type="info">Documentation</el-tag>
    </a>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="ID" width="80">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="Description" prop="description"> </el-table-column>
      <el-table-column prop="language" width="120px" align="center" label="Language">
      </el-table-column>
      <el-table-column width="180px" align="center" label="Date">
        <template #default="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="has_projects" width="110">
        <template #default="scope">
          <el-tag :type="statusFilter(scope.row.has_projects)">
            {{ scope.row.has_projects }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onBeforeMount } from 'vue'
import { transactionList } from '@/apis/github'
import { parseTime } from '@/utils'
import { ElMessage } from 'element-plus'

// TODO add v-model 父子组件双向绑定处理

export default {
  name: 'SelectExcel',
  setup() {
    const multipleTable = ref(null)
    const state = reactive({
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: ''
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
      if (state.multipleSelection.length) {
        state.downloadLoading = true
        import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = ['Id', 'Title', 'Description', 'Language', 'Date']
          const filterVal = ['id', 'name', 'description', 'language', 'created_at']
          const list = state.multipleSelection
          const data = formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: state.filename
          })
          multipleTable.value.clearSelection()
          state.downloadLoading = false
        })
      } else {
        ElMessage({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
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
