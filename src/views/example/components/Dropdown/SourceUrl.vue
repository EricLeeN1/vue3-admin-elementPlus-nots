<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      Link
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-padding no-border" style="width: 400px">
        <el-form-item label-width="0px" style="margin-bottom: 0px" prop="sourceUri">
          <el-input v-model="sourceUri" placeholder="Please enter the content">
            <template slot="prepend"> URL </template>
          </el-input>
        </el-form-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const sourceUri = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    return {
      sourceUri
    }
  }
}
</script>

<style lang="scss" scoped></style>
