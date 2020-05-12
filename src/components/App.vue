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
        <button><fa-icon icon="plus" /> New</button>
      </draggable>
      <router-link to="/help">Help</router-link>
      <button v-if="user" v-on:click="logout">{{ user.name }} Logout</button>
      <router-link v-else to="/login">Login</router-link>
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
  a,
  button {
    @apply block p-2;
    &:hover {
      @apply bg-contrast;
    }
    &.router-link-exact-active {
      @apply bg-contrast;
    }
  }
  div.shortcuts {
    @apply flex flex-1;
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
import { items, users } from '@/models/database';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import ItemData from '@/models/ItemData';
import Change from '@/models/Change';
import ItemLink from '@/components/ItemLink.vue';
import Draggable from 'vuedraggable';
import { firebaseAuth } from '@/models/auth';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';

@Component({ components: { Draggable, FaIcon, ItemLink } })
export default class App extends Vue {
  user: object | null = null;
  items: ItemData[] = [];

  get dragModel() {
    return this.items.map(item => item.id);
  }

  mounted() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.$bind('user', users.doc(user.uid));
        this.$bind('items', items.where('parent', '==', null).orderBy('order'));
      } else {
        this.user = null;
        this.items = [];
      }
    });
  }

  logout() {
    firebaseAuth.signOut();
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
