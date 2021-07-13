<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      Platfroms({{ platforms.length }})
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="no-border">
        <el-checkbox-group v-model="platforms" style="padding: 5px 15px">
          <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'

export default {
  props: {
    modelValue: {
      required: true,
      default: () => [],
      type: Array
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const state = reactive({
      platformsOptions: [
        { key: 'a-platform', name: 'a-platform' },
        { key: 'b-platform', name: 'b-platform' },
        { key: 'c-platform', name: 'c-platform' }
      ]
    })
    const platforms = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        console.log(val)
        emit('update:modelValue', val)
      }
    })
    return {
      ...toRefs(state),
      platforms
    }
  }
}
</script>

<style lang="scss" scoped></style>
