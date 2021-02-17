<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>

<template>
  <div class="home text" v-title="'# Notes'">
    <h1># Notes</h1>
    <p>Write notes in Markdown.</p>
  </div>
</template>

<style lang="scss" scoped>
div.text {
  @apply p-4 mx-auto;
}
h1 {
  @apply text-3xl;
}
</style>
