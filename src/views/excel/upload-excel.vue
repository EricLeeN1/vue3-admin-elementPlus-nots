<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top: 20px">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'

// TODO add v-model 父子组件双向绑定处理

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  setup() {
    const state = reactive({
      tableData: [],
      tableHeader: []
    })
    const beforeUpload = (file) => {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      ElMessage({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    }
    const handleSuccess = ({ results, header }) => {
      state.tableData = results
      state.tableHeader = header
    }
    return {
      ...toRefs(state),
      beforeUpload,
      handleSuccess
    }
  }
}
</script>
