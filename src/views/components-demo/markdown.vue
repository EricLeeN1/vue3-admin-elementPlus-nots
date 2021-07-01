<template>
  <div class="components-container">
    <aside>
      Markdown is based on
      <a href="https://github.com/nhnent/tui.editor" target="_blank">tui.editor</a> ，simply wrapped
      with Vue.
      <a
        target="_blank"
        href="https://panjiachen.github.io/vue-element-admin-site/feature/component/markdown-editor.html"
      >
        Documentation
      </a>
    </aside>

    <div class="editor-container">
      <el-tag class="tag-title"> Basic: </el-tag>
      <markdown-editor v-model="content1" height="300px" />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title"> Markdown Mode: </el-tag>
      <markdown-editor
        ref="markdownEditor"
        v-model="content2"
        :options="{ hideModeSwitch: true, previewStyle: 'tab' }"
        height="200px"
      />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title"> Customize Toolbar: </el-tag>
      <markdown-editor
        v-model="content3"
        :options="{ toolbarItems: ['heading', 'bold', 'italic'] }"
      />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title"> I18n: </el-tag>
      <el-alert
        :closable="false"
        title="You can change the language of the admin system to see the effect"
        type="success"
      />
      <markdown-editor
        ref="markdownEditorRef"
        v-model="content4"
        :language="language"
        height="300px"
      />
    </div>

    <el-button style="margin-top: 80px" type="primary" icon="el-icon-document" @click="getHtml">
      Get HTML
    </el-button>
    <div v-html="html" />
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import { reactive, toRefs, computed, ref } from 'vue'

const content = `
**This is test**

* vue
* element
* webpack

`
export default {
  name: 'MarkdownDemo',
  components: { MarkdownEditor },
  setup() {
    const markdownEditorRef = ref(null)
    const state = reactive({
      content1: content,
      content2: content,
      content3: content,
      content4: content,
      html: '',
      languageTypeList: {
        en: 'en_US',
        zh: 'zh_CN',
        es: 'es_ES'
      }
    })
    const language = computed(() => state.languageTypeList.en)
    const getHtml = () => {
      state.html = markdownEditorRef.value.getHtml()
      console.log(state.html)
    }
    return {
      ...toRefs(state),
      language,
      getHtml
    }
  }
}
</script>

<style lang="scss" scoped></style>
