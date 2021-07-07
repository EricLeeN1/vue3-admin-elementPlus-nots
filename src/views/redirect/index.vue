<script>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    onMounted(() => {
      const { params, query } = route
      const { path } = params
      router.replace({ path: `/${path}`, query })
    })
    return {}
  }
  // render() {
  //   return h() // avoid warning message
  // }
}
</script>

<style lang="scss" scoped></style>
