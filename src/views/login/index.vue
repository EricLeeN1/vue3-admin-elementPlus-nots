<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="form"
      :rules="rules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Vite + Vue3 + Axios + Vue-router + Vuex</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userNameRef"
          v-model="form.username"
          placeholder="请输入用户名称"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model="form.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <div style="position: relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right: 18px">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="toggleDialog(true)">
          第三方登录
        </el-button>
      </div>
    </el-form>

    <el-dialog title="第三方登录" v-model="showDialog">
      Can not be simulated on local, so please combine you own business simulation! !
      !(不能在本地模拟，所以请结合您自己的业务模拟！!!!)
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { nextTick, watch, ref, onMounted, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import SocialSign from './components/SocialSignin.vue'

export default {
  components: {
    SocialSign
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const loginFormRef = ref(null)
    const userNameRef = ref(null)
    const passwordRef = ref(null)
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const state = reactive({
      form: {
        username: 'admin',
        password: '1231231'
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    })
    const checkCapslock = (e) => {
      const { key } = e
      state.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    }
    const showPwd = () => {
      if (state.passwordType === 'password') {
        state.passwordType = ''
      } else {
        state.passwordType = 'password'
      }
      nextTick(() => {
        passwordRef.value.focus()
      })
    }
    const getOtherQuery = (query) => {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    const toggleDialog = (bol) => {
      state.showDialog = bol
    }
    onMounted(() => {
      if (state.form.username === '') {
        userNameRef.value.focus()
      } else if (state.form.password === '') {
        passwordRef.value.focus()
      }
    })
    const handleLogin = () => {
      // eslint-disable-next-line consistent-return
      loginFormRef.value.validate((valid) => {
        if (valid) {
          state.loading = true
          store
            .dispatch('user/login', state.form)
            .then(() => {
              router.push({ path: state.redirect || '/', query: state.otherQuery })
              state.loading = false
            })
            .catch((err) => {
              console.log(err)
              state.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    watch(
      () => route.path,
      () => {
        console.log('监听到变化')
        const { query } = route
        if (query) {
          state.redirect = query.redirect
          state.otherQuery = getOtherQuery(query)
        }
      }
    )
    return {
      ...toRefs(state),
      loginFormRef,
      userNameRef,
      passwordRef,
      checkCapslock,
      showPwd,
      toggleDialog,
      getOtherQuery,
      handleLogin
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
