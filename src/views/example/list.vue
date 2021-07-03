<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
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

      <el-table-column min-width="300px" label="Title">
        <template #default="{ row }">
          <router-link :to="'/example/edit/' + row.id" class="link-type">
            <span>{{ row.name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template #default="scope">
          <router-link :to="'/example/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"> Edit </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { transactionList } from '@/apis/github'
import Pagination from '@/components/Pagination/index.vue'
// Secondary package based on el-pagination
export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  setup() {
    const state = reactive({
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        per_page: 10
      }
    })
    const statusFilter = (status) => {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    const getList = () => {
      state.listLoading = true
      transactionList(state.listQuery).then((res) => {
        console.log(res)
        state.list = res
        // state.total = res
        state.listLoading = false
      })
    }
    onMounted(() => {
      getList()
    })
    return {
      ...toRefs(state),
      statusFilter,
      getList
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
