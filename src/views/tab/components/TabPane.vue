<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template #default="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="Date">
      <template #default="scope">
        <span>{{ scope.row.created_at }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="Title">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
        <el-tag>{{ row.language }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="Author">
      <template #default="scope">
        <span>{{ scope.row.description }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="Importance"> </el-table-column>

    <el-table-column align="center" label="Readings" width="95">
      <template #default="scope">
        <span>{{ scope.row.has_projects }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Status" width="110">
      <template #default="{ row }">
        <el-tag :type="statusFilter(row.has_projects)">
          {{ row.has_projects }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { reactive, toRefs, onBeforeMount } from 'vue'
import { transactionList } from '@/apis/github'

export default {
  emit: ['create'],
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      list: null,
      listQuery: {
        page: 1,
        per_page: 10,
        type: props.type,
        sort: '+id'
      },
      loading: false
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
      state.loading = true
      emit('create') // for test
      transactionList(state.listQuery).then((response) => {
        state.list = response.data
        state.loading = false
      })
    }
    onBeforeMount(() => {
      getList()
    })
    return {
      ...toRefs(state),
      getList,
      statusFilter
    }
  }
}
</script>

<style lang="scss" scoped></style>
