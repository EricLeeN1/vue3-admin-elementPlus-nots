<template>
  <div style="display: inline-block">
    <label class="radio-label">Book Type: </label>
    <el-select v-model="bookType" style="width: 120px">
      <el-option v-for="item in options" :key="item" :label="item" :value="item" />
    </el-select>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: String,
      default: 'xlsx'
    }
  },
  setup(props, { emit }) {
    const bookType = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('update:value', val)
      }
    })
    return {
      options: ['xlsx', 'csv', 'txt'],
      bookType
    }
  }
}
</script>

<style lang="scss" scoped></style>
