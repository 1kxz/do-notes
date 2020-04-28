<template>
  <div id="app">
    <nav>
      <router-link to="/">doNotes</router-link>
      <router-link
        v-for="item in items"
        v-bind:key="item.id"
        v-bind:to="{ name: 'Viewer', params: { id: item.id } }"
        >{{ item.text.split('\n', 1)[0] }}</router-link
      >
      <router-link to="/help">Help</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  nav {
    @apply bg-color text-soft flex leading-none;
  }
  a {
    @apply block p-2;
    &:hover {
      @apply bg-contrast;
    }
    &.router-link-exact-active {
      @apply bg-contrast;
    }
  }
  div {
    @apply m-2;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/db';

@Component
export default class App extends Vue {
  items = [];

  mounted() {
    const freeItems = items.where('parent', '==', null).orderBy('order');
    this.$bind('items', freeItems);
  }
}
</script>
