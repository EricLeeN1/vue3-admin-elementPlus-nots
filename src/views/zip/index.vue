<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default file)"
      style="width: 300px"
      prefix-icon="el-icon-document"
    />
    <el-button
      :loading="downloadLoading"
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >
      Export Zip
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="80">
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="language" width="120px" align="center" label="Language">
      </el-table-column>

      <el-table-column class-name="status-col" label="has_projects" width="110">
        <template #default="scope">
          <el-tag :type="statusFilter(scope.row.has_projects)">
            {{ scope.row.has_projects }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Description" prop="description"> </el-table-column>

      <!-- <el-table-column align="center" label="Actions" width="120">
        <template #default="scope">
          <router-link :to="'/example/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"> Edit </el-button>
          </router-link>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount } from 'vue'
import { transactionList } from '@/apis/github'

export default {
  name: 'ExportZip',
  setup() {
    const state = reactive({
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: ''
    })
    const fetchData = async () => {
      state.listLoading = true
      const data = await transactionList()
      state.list = data
      state.listLoading = false
    }
    const formatJson = (filterVal, jsonData) => {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    }
    const handleDownload = () => {
      state.downloadLoading = true
      import('@/vendor/Export2Zip').then((zip) => {
        const tHeader = ['Id', 'Title', 'Description', 'Language', 'Date']
        const filterVal = ['id', 'name', 'description', 'language', 'created_at']
        const { list } = state
        const data = formatJson(filterVal, list)
        zip.export_txt_to_zip(tHeader, data, state.filename, state.filename)
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
    onBeforeMount(() => {
      fetchData()
    })
    return {
      ...toRefs(state),
      fetchData,
      handleDownload,
      statusFilter,
      formatJson
    }
  }
}
</script>

<style lang="scss" scoped></style>
