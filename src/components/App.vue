<template>
  <div id="app">
    <nav>
      <router-link to="/">Notes</router-link>
      <draggable
        group="items"
        class="shortcuts"
        draggable="a"
        v-bind:list="dragModel"
        v-on:change="dragChange"
      >
        <item-link
          v-for="item in items"
          v-bind:key="item.id"
          v-bind:item="item"
        />
        <button v-if="user" slot="footer"><fa-icon icon="plus" /> New</button>
      </draggable>
      <router-link to="/help">Help</router-link>
      <span v-if="user">{{ account }}</span>
      <button v-if="user" v-on:click="logout">Logout</button>
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
  button,
  span {
    @apply block p-2;
  }
  a,
  button {
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
import { firebaseAuth } from '@/models/auth';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import { items, users } from '@/models/database';
import Change from '@/models/Change';
import Draggable from 'vuedraggable';
import ItemData from '@/models/ItemData';
import ItemLink from '@/components/ItemLink.vue';
import UserData from '@/models/UserData';

@Component({ components: { Draggable, FaIcon, ItemLink } })
export default class App extends Vue {
  user: UserData | null = null;
  items: ItemData[] = [];

  get dragModel() {
    return this.items.map(item => item.id);
  }

  get account() {
    return this.user?.name || this.user?.email || 'Unknown';
  }

  mounted() {
    firebaseAuth.onAuthStateChanged(auth => {
      if (auth) {
        const puser = users.doc(auth.uid);
        puser.update({ name: auth.displayName, email: auth.email });
        this.$bind('user', puser);
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
