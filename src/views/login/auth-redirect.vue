<script>
import { onBeforeMount } from 'vue'

export default {
  name: 'AuthRedirect',
  setup() {
    onBeforeMount(() => {
      const hash = window.location.search.slice(1)
      if (window.localStorage) {
        window.localStorage.setItem('x-admin-oauth-code', hash)
        window.close()
      }
    })
    return {}
  },
  render(h) {
    return h() // avoid warning message
  }
}
</script>

<style lang="scss" scoped></style>
