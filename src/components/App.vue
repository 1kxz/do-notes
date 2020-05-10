<template>
  <div id="app">
    <nav>
      <router-link to="/">Notes</router-link>
      <draggable
        group="items"
        class="shortcuts"
        v-bind:list="dragModel"
        v-on:change="dragChange"
      >
        <item-link
          v-for="item in items"
          v-bind:key="item.id"
          v-bind:item="item"
        />
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
    ::v-deep .item {
      @apply border-0;
      .title {
        @apply block p-2 bg-contrast text-soft leading-none;
      }
      .body,
      .subitems,
      button {
        @apply hidden;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/database';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import ItemData from '@/models/ItemData';
import Change from '@/models/Change';
import ItemLink from '@/components/ItemLink.vue';
import Draggable from 'vuedraggable';

@Component({ components: { Draggable, ItemLink } })
export default class App extends Vue {
  items: ItemData[] = [];

  get dragModel() {
    return this.items.map(item => item.id);
  }

  mounted() {
    const freeItems = items.where('parent', '==', null).orderBy('order');
    this.$bind('items', freeItems);
  }

  dragChange(change: Change) {
    if (change.added) {
      itemAdd({
        item: change.added.element,
        index: change.added.newIndex
      });
    } else if (change.moved) {
      itemMove({
        old: change.moved.oldIndex,
        new: change.moved.newIndex
      });
    } else if (change.removed) {
      itemRemove({
        item: change.removed.element,
        index: change.removed.oldIndex
      });
    }
  }
}
</script>
