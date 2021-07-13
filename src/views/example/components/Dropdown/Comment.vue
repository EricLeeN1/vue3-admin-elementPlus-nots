<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ !commentDisabled ? 'Comment: opened' : 'Comment: closed' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding">
        <el-dropdown-item>
          <el-radio-group v-model="commentDisabled" style="padding: 10px">
            <el-radio :label="true"> Close comment </el-radio>
            <el-radio :label="false"> Open comment </el-radio>
          </el-radio-group>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const commentDisabled = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    return {
      commentDisabled
    }
  }
}
</script>

<style lang="scss" scoped></style>
