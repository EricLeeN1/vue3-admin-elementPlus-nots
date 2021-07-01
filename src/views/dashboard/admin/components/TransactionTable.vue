<template>
  <el-table :data="lists" style="width: 100%; padding-top: 15px">
    <el-table-column label="Id" min-width="30" prop="id"> </el-table-column>
    <el-table-column label="Name" min-width="60" prop="name"> </el-table-column>
    <el-table-column label="Language" min-width="50" prop="language"> </el-table-column>
    <el-table-column label="Time" width="195" align="center" prop="pushed_at"> </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="scope">
        <el-tag :type="scope.row.status ? 'success' : 'danger'">
          {{ scope.row.has_pages ? '有地址' : '无地址' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/apis/github'
import { onMounted, reactive, toRefs } from 'vue'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    }
  },
  setup() {
    const state = reactive({
      lists: []
    })
    const fetchData = () => {
      for (let index = 0; index < 10; index += 1) {
        transactionList().then((response) => {
          state.lists = response.data
        })
      }
    }
    onMounted(() => {
      fetchData()
    })
    return {
      ...toRefs(state),
      fetchData
    }
  }
}
</script>

<style lang="scss" scoped></style>
