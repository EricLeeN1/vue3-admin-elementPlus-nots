<template>
  <div style="display: inline-block">
    <label class="radio-label">Cell Auto-Width: </label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border> True </el-radio>
      <el-radio :label="false" border> False </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const autoWidth = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('update:value', val)
      }
    })
    return {
      autoWidth
    }
  }
}
</script>

<style lang="scss" scoped></style>
