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
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const filename = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    return {
      filename
    }
  }
}
</script>

<style lang="scss" scoped></style>
