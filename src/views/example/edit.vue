<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/ArticleDetai.vue'

export default {
  name: 'EditArticle',
  components: { ArticleDetail }
}
</script>

<style lang="scss" scoped></style>
