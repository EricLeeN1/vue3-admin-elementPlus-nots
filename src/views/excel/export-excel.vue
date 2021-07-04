<template>
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Export Excel
      </el-button>
      <a
        href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html"
        target="_blank"
        style="margin-left: 15px"
      >
        <el-tag type="info">Documentation</el-tag>
      </a>
    </div>

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
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount } from 'vue'
import { transactionList } from '@/apis/github'
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption.vue'
import AutoWidthOption from './components/AutoWidthOption.vue'
import BookTypeOption from './components/BookTypeOption.vue'

// TODO add v-model 父子组件双向绑定处理

export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  setup() {
    const state = reactive({
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
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
        const tHeader = ['Id', 'Title', 'Description', 'Language', 'Date']
        const filterVal = ['id', 'name', 'description', 'language', 'created_at']
        const { list } = state
        const data = formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: state.filename,
          autoWidth: state.autoWidth,
          bookType: state.bookType
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
    onBeforeMount(() => {
      fetchData()
    })
    return {
      ...toRefs(state),
      fetchData,
      statusFilter,
      handleDownload,
      formatJson
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
