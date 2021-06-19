<template>
  <div>123</div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { getLists } from '@/apis/github'
export default defineComponent({
  setup() {
    // let getLists = () => {

    // };
    onMounted(() => {
      console.log(getLists)
      try {
        getLists
          .then((res) => {
            console.log('res: ', res)
          })
          .catch((err) => {
            console.log('err: ', err)
          })
      } catch (error) {
        console.log('error: ', error)
      }
    })
    return {
      getLists
    }
  }
})
</script>

<style lang="scss" scoped></style>
