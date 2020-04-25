<template>
  <div id="app">
    <nav>
      <router-link to="/">doNotes</router-link>
      <router-link to="/help">Help</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
nav {
  @apply bg-soft;
}
a {
  @apply p-2;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
