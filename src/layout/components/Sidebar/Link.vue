<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isExternalRes = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (isExternalRes) {
        return 'a'
      }
      return 'router-link'
    })
    const linkProps = (to) => {
      if (isExternalRes) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to,
        type,
        linkProps
      }
    }
    return {
      linkProps
    }
  }
}
</script>

<style lang="scss" scoped></style>
