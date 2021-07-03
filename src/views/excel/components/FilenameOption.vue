<template>
  <div style="display: inline-block">
    <label class="radio-label" style="padding-left: 0">Filename: </label>
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default excel-list)"
      style="width: 345px"
      prefix-icon="el-icon-document"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const filename = computed({
      get() {
        return props.value
      },
      set(val) {
        console.log(val)
        emit('update:value', val)
      }
    })
    return {
      filename
    }
  }
}
</script>

<style lang="scss" scoped></style>
