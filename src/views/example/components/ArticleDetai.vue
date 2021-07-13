<template>
  <div class="createPost-container">
    <el-form ref="postFormRef" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm"> Draft </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                Title
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.author"
                      :remote-method="getRemoteUserList"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search user"
                    >
                      <el-option
                        v-for="(item, index) in userListOptions"
                        :key="item + index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item
                    label-width="120px"
                    label="Publish Time:"
                    class="postInfo-container-item"
                  >
                    <el-date-picker
                      v-model="displayTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="Importance:"
                    class="postInfo-container-item"
                  >
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display: inline-block"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px" label-width="70px" label="Summary:">
          <el-input
            v-model="postForm.content_short"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}words</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { validURL } from '@/utils/validate'
import { transactionDetails } from '@/apis/github'
import { ElMessage, ElNotification } from 'element-plus'
import Tinymce from '@/components/Tinymce/index.vue'
import Upload from '@/components/Upload/SingleImage3.vue'
import MDinput from '@/components/MDinput/index.vue'
import Sticky from '@/components/Sticky/index.vue' // 粘性header组件
import Warning from './Warning.vue'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown/index'

const validateRequire = (rule, value, callback) => {
  if (value === '') {
    ElMessage({
      message: `${rule.field}为必传项`,
      type: 'error'
    })
    callback(new Error(`${rule.field}为必传项`))
  } else {
    callback()
  }
}
const validateSourceUri = (rule, value, callback) => {
  if (value) {
    if (validURL(value)) {
      callback()
    } else {
      ElMessage({
        message: '外链url填写不正确',
        type: 'error'
      })
      callback(new Error('外链url填写不正确'))
    }
  } else {
    callback()
  }
}
const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: '', // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}
export default {
  name: 'ArticleDetail',
  components: {
    Tinymce,
    MDinput,
    Upload,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const postFormRef = ref(null)
    const store = useStore()
    const state = reactive({
      postForm: { ...defaultForm },
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    })
    const contentShortLength = computed(() => state.postForm.content_short.length)
    const displayTime = computed({
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return state.postForm.display_time ? +new Date(state.postForm.display_time) : new Date()
      },
      set(val) {
        state.postForm.display_time = new Date(val)
      }
    })
    const setTagsViewTitle = () => {
      const title = 'Edit Article'
      const route = { ...state.tempRoute, title: `${title}-${state.postForm.id}` }
      store.dispatch('tagsView/updateVisitedView', route)
    }
    const setPageTitle = () => {
      const title = 'Edit Article'
      document.title = `${title} - ${state.postForm.id}`
    }
    const fetchData = (id) => {
      transactionDetails(id)
        .then((response) => {
          state.postForm = response.data

          // just for test
          state.postForm.title += `   Article Id:${state.postForm.id}`
          state.postForm.content_short += `   Article Id:${state.postForm.id}`

          // set tagsview title
          setTagsViewTitle()

          // set page title
          setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const submitForm = () => {
      // eslint-disable-next-line consistent-return
      postFormRef.value.validate((valid) => {
        if (valid) {
          state.loading = true
          ElNotification.success({
            title: '成功',
            message: '发布文章成功',
            duration: 2000
          })
          state.postForm.status = 'published'
          state.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    const draftForm = () => {
      if (state.postForm.content.length === 0 || state.postForm.title.length === 0) {
        ElMessage({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      ElMessage({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      state.postForm.status = 'draft'
    }
    const getRemoteUserList = (query) => {
      transactionDetails(query).then((response) => {
        if (!response.data.items) return
        state.userListOptions = response.data.items.map((v) => v.name)
      })
    }
    return {
      ...toRefs(state),
      contentShortLength,
      displayTime,
      postFormRef,
      fetchData,
      setTagsViewTitle,
      setPageTitle,
      submitForm,
      draftForm,
      getRemoteUserList
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
