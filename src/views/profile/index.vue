<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import UserCard from './components/UserCard.vue'
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'
import Account from './components/Account.vue'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  setup() {
    const store = useStore()
    const state = reactive({
      user: {},
      activeTab: 'activity'
    })
    const name = computed(() => store.getters.name)
    const avatar = computed(() => store.getters.avatar)
    const roles = computed(() => store.getters.roles)
    const getUser = () => {
      state.user = {
        name,
        role: roles.value.join(' | '),
        email: 'admin@test.com',
        avatar
      }
    }
    onMounted(() => {
      getUser()
    })
    return {
      ...toRefs(state),
      name,
      avatar,
      roles,
      getUser
    }
  }
}
</script>

<style lang="scss" scoped></style>
