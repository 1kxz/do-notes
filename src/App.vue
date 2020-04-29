<template>
  <div id="app">
    <nav>
      <router-link to="/">notes (4)</router-link>
      <draggable
        group="items"
        class="shortcuts"
        v-bind:list="items"
        v-on:change="dragChange"
      >
        <router-link
          v-for="(item, i) in items"
          v-bind:key="i"
          v-bind:to="{ name: 'Viewer', params: { id: item.id } }"
          >{{ item.text.split('\n', 1)[0] }} ({{ item.order }})</router-link
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
  section {
    @apply m-2;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/database';
import ItemData from '@/models/ItemData';
import { functions } from '@/models/functions';
import Draggable from 'vuedraggable';

class Moved {
  newIndex!: number;
  oldIndex!: number;
  element!: ItemData;
}

class Change {
  moved?: Moved;
}

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
      const moveItems = functions.httpsCallable('moveItems');
      moveItems({
        id: moved.element.parent,
        old: moved.oldIndex,
        new: moved.newIndex
      }).then(console.log);
    }
  }
}
</script>
