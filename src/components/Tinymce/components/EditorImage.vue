<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      upload
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <el-button size="small" type="primary"> Click upload </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> Cancel </el-button>
      <el-button type="primary" @click="handleSubmit"> Confirm </el-button>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  setup(props, { emit }) {
    const { ctx } = getCurrentInstance()
    const state = reactive({
      dialogVisible: false,
      listObj: {},
      fileList: []
    })
    const checkAllSuccess = () => {
      return Object.keys(state.listObj).every((item) => state.listObj[item].hasSuccess)
    }
    const handleSubmit = () => {
      const arr = Object.keys(state.listObj).map((v) => state.listObj[v])
      if (!checkAllSuccess()) {
        this.$message(
          'Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!'
        )
        return
      }
      emit('successCBK', arr)
      state.listObj = {}
      state.fileList = []
      state.dialogVisible = false
    }
    const handleSuccess = (response, file) => {
      const { uid } = file
      const objKeyArr = Object.keys(state.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i = +1) {
        if (state.listObj[objKeyArr[i]].uid === uid) {
          state.listObj[objKeyArr[i]].url = response.files.file
          state.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    }
    const handleRemove = (file) => {
      const { uid } = file
      const objKeyArr = Object.keys(state.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i = +1) {
        if (state.listObj[objKeyArr[i]].uid === uid) {
          delete state.listObj[objKeyArr[i]]
          return
        }
      }
    }
    const beforeUpload = (file) => {
      // eslint-disable-next-line no-underscore-dangle
      const _self = ctx
      // eslint-disable-next-line no-underscore-dangle
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = () => {
          _self.listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: state.width,
            height: state.height
          }
        }
        resolve(true)
      })
    }
    return {
      ...toRefs(state),
      checkAllSuccess,
      handleSubmit,
      beforeUpload,
      handleRemove,
      handleSuccess
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
