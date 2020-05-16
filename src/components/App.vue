<template>
  <div id="app">
    <nav>
      <router-link to="/"># Notes</router-link>
      <draggable
        group="items"
        class="shortcuts"
        draggable="a"
        v-bind:list="dragModel"
        v-on:change="dragChange"
      >
        <item-link
          v-for="item in subitems"
          v-bind:key="item.id"
          v-bind:item="item"
        />
        <button v-if="user" slot="footer" v-on:click="addClick">
          <fa-icon icon="plus" /> New
        </button>
      </draggable>
      <router-link to="/help">Help</router-link>
      <span v-if="user"><fa-icon icon="user" /> {{ account }} </span>
      <button v-if="user" v-on:click="exportClick">
        <fa-icon icon="download" /> Export
      </button>
      <button v-if="user" v-on:click="logoutClick">
        <fa-icon icon="sign-out-alt" /> Sign out
      </button>
      <router-link v-else to="/login">
        <fa-icon icon="sign-in-alt" /> Sign in
      </router-link>
    </nav>
    <section>
      <router-view />
    </section>
  </div>
</template>

<style lang="scss" scoped>
#app {
  nav {
    @apply bg-color flex leading-none shadow;
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
import router from '@/router/index';
import UserData from '@/models/UserData';

@Component({ components: { Draggable, FaIcon, ItemLink } })
export default class App extends Vue {
  user: UserData | null = null;
  subitems: ItemData[] = [];

  get dragModel() {
    return this.subitems.map(item => item.id);
  }

  get account() {
    return this.user?.name || this.user?.email || 'Unknown';
  }

  mounted() {
    firebaseAuth.onAuthStateChanged(auth => {
      if (auth) {
        const user = { name: auth.displayName, email: auth.email };
        users
          .doc(auth.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              doc.ref.update(user);
            } else {
              doc.ref.set(user);
            }
            this.$bind('user', doc.ref);
            this.$bind(
              'subitems',
              items
                .where('uid', '==', auth.uid)
                .where('parent', '==', null)
                .orderBy('order')
            );
          });
      } else {
        this.user = null;
        this.subitems = [];
      }
    });
  }

  logoutClick() {
    firebaseAuth.signOut();
    router.push('Login');
  }

  exportClick() {
    if (this.user) {
      items
        .where('uid', '==', this.user.id)
        .get()
        .then(qs => {
          const data = qs.docs.map(item => {
            const { parent, ...copy } = item.data();
            delete copy.uid;
            return { id: item.id, parent: parent?.id, ...copy };
          });
          const dataStr = encodeURIComponent(JSON.stringify(data));
          const a = document.createElement('a');
          a.setAttribute('href', `data:text/json;charset=utf-8,${dataStr}`);
          a.setAttribute('download', 'Notes.json');
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    }
  }

  addClick() {
    if (this.user) {
      items
        .add({
          uid: this.user.id,
          parent: null,
          order: this.subitems ? this.subitems.length : 0,
          text: 'New',
          view: 'note',
          noteOrientation: 'horizontal'
        })
        .then(x => router.push({ name: 'Editor', params: { id: x.id } }));
    }
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
