<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="use clipboard  directly" name="directly">
        <el-input
          v-model="inputData"
          placeholder="Please input"
          style="width: 400px; max-width: 100%"
        />
        <el-button type="primary" icon="el-icon-document" @click="handleCopy(inputData, $event)">
          copy
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="use clipboard by v-directive" name="v-directive">
        <el-input
          v-model="inputData"
          placeholder="Please input"
          style="width: 400px; max-width: 100%"
        />
        <!-- <el-button
          v-clipboard:copy="inputData"
          v-clipboard:success="clipboardSuccess"
          type="primary"
          icon="el-icon-document"
        >
          copy
        </el-button> -->
        <el-button type="primary" icon="el-icon-document"> copy </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
// import clipboard from '@/directive/clipboard/index'
// TODO: use clipboard by v-directive
export default {
  name: 'ClipboardDemo',
  // directives: {
  //   clipboard
  // },
  setup() {
    const handleCopy = (text, event) => {
      clip(text, event)
    }
    const clipboardSuccess = () => {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    }
    return {
      activeName: 'directly',
      inputData: 'https://github.com/PanJiaChen/vue-element-admin',
      handleCopy,
      clipboardSuccess
    }
  }
}
</script>

<style lang="scss" scoped></style>
