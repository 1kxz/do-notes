<template>
  <div class="home text">
    <h1># Notes</h1>
    <p>Simple and fast app to write notes in Mardown.</p>
  </div>
</template>

<style lang="scss" scoped>
.text {
  @apply p-4 mx-auto;
  h1 {
    @apply text-3xl;
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>
