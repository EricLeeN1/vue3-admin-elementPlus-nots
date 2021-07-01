<template>
  <div>
    <i :class="[icon, 'sub-el-icon']" v-if="elIcon" />
    <svg-icon :icon-class="icon" v-else />
    <span slot="title">{{ title }}</span>
  </div>
</template>

<script>
import { computed, h } from 'vue'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const elIcon = computed(() => props.icon.includes('el-icon'))
    return {
      elIcon
    }
  },
  render(context) {
    console.log(context)
    // const { icon, title } = context.props
    // const vnodes = []
    // console.log(icon, title)

    // if (icon) {
    //   if (icon.includes('el-icon')) {
    //     vnodes.push(<i class={[icon, 'sub-el-icon']} />)
    //   } else {
    //     vnodes.push(<svg-icon icon-class={icon}/>)
    //   }
    // }

    return h('div', [
      h('header', this.$slots.header()),
      h('main', this.$slots.default()),
      h('footer', this.$slots.footer())
    ])
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
