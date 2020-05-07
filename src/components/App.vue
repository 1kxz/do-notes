<template>
  <div id="app">
    <nav>
      <router-link to="/">notes (5)</router-link>
      <draggable
        group="items"
        class="shortcuts"
        v-bind:list="items"
        v-on:change="dragChange"
      >
        <router-link
          v-for="item in items"
          v-bind:key="item.id"
          v-bind:to="{ name: 'Viewer', params: { id: item.id } }"
          >{{ item.text.split('\n', 1)[0] }}</router-link
        >
      </draggable>
      <router-link to="/help">Help</router-link>
    </nav>
    <section>
      <router-view />
    </section>
  </div>
</template>

<style lang="scss" scoped>
#app {
  nav {
    @apply bg-color flex leading-none;
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
  div.shortcuts {
    @apply flex;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/database';
import { itemMove } from '@/models/functions';
import Change from '@/models/Change';
import Draggable from 'vuedraggable';

@Component({ components: { Draggable } })
export default class App extends Vue {
  items = [];

  mounted() {
    const freeItems = items.where('parent', '==', null).orderBy('order');
    this.$bind('items', freeItems);
  }

  dragChange(change: Change) {
    const moved = change.moved;
    if (moved) {
      itemMove({
        parent: moved.element.parent?.id,
        old: moved.oldIndex,
        new: moved.newIndex
      }).then(console.log);
    }
  }
}
</script>
