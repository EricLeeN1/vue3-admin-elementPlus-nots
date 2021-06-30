<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="userInfo.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="userInfo.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  setup(props) {
    const submit = () => {
      ElMessage({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
    const state = reactive({
      userInfo: props.user
    })
    return {
      ...toRefs(state),
      submit
    }
  }
}
</script>

<style lang="scss" scoped></style>
