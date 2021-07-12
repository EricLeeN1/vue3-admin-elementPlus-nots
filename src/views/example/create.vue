<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetai.vue'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail }
}
</script>

<style lang="scss" scoped></style>
