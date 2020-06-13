<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { firebaseAuth } from '@/auth';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { itemAdd, itemMove, itemRemove } from '@/functions';
import { items, users } from '@/database';
import { themes } from '@/themes';
import Change from '@/models/Change';
import Draggable from 'vuedraggable';
import Item from '@/models/Item';
import ItemLink from '@/components/ItemLink.vue';
import Logo from '@/components/Logo.vue';
import User from '@/models/User';

@Component({ components: { Draggable, FaIcon, ItemLink, Logo } })
export default class App extends Vue {
  user: User | null = null;
  subitems: Item[] = [];
  showUserMenu = false;
  themeId = 'Random';

  mounted() {
    this.changeTheme(this.themeId);
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

  get account() {
    return this.user?.name || this.user?.email || 'Unknown';
  }

  get themeOptions() {
    const options: string[] = [];
    for (const theme in themes) {
      if (theme != this.themeId) {
        options.push(theme);
      }
    }
    return options;
  }

  themeValues(themeId: string) {
    return themes[themeId];
  }

  changeTheme(themeId: string) {
    const options = this.themeOptions;
    while (themeId === 'Random') {
      themeId = options[Math.floor(Math.random() * options.length)];
    }
    const values = this.themeValues(themeId);
    for (const key in values) {
      document.documentElement.style.setProperty(`--${key}`, values[key]);
    }
    this.themeId = themeId;
    this.showUserMenu = false;
  }

  logoutClick() {
    firebaseAuth.signOut();
    this.showUserMenu = false;
    this.$router.push('Login');
  }

  exportClick() {
    if (this.user) {
      items
        .where('uid', '==', this.user.id)
        .orderBy('parent')
        .orderBy('order')
        .get()
        .then(qs => {
          const data = qs.docs.map(item => {
            const { ...copy } = item.data();
            delete copy.uid;
            return { id: item.id, ...copy };
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
    this.showUserMenu = false;
  }

  importClick() {
    this.showUserMenu = false;
    this.$router.push('/import');
  }

  helpClick() {
    this.showUserMenu = false;
    this.$router.push('/help');
  }

  addClick() {
    if (this.user) {
      items
        .add({
          uid: this.user.id,
          parent: null,
          order: this.subitems ? this.subitems.length : 0,
          title: 'New board',
          content: '',
          view: 'board'
        })
        .then(x =>
          this.$router.push({ name: 'ItemEdit', params: { id: x.id } })
        );
    }
  }

  get dragModel() {
    return this.subitems.map(item => item.id);
  }

  dragChange(change: Change) {
    if (this.user) {
      if (change.added) {
        itemAdd({
          uid: this.user.id,
          parentId: null,
          itemId: change.added.element,
          newIndex: change.added.newIndex
        });
      } else if (change.moved) {
        itemMove({
          uid: this.user.id,
          parentId: null,
          oldIndex: change.moved.oldIndex,
          newIndex: change.moved.newIndex
        });
      } else if (change.removed) {
        itemRemove({
          uid: this.user.id,
          parentId: null,
          itemId: change.removed.element,
          oldIndex: change.removed.oldIndex
        });
      }
    }
  }
}
</script>

<template>
  <div id="app" v-bind:class="themeId.toLowerCase()">
    <nav>
      <draggable
        group="items"
        class="shortcuts"
        draggable=".item-link"
        v-bind:list="dragModel"
        v-on:change="dragChange"
      >
        <router-link to="/" slot="header"># Notes</router-link>
        <item-link
          v-for="item in subitems"
          v-bind:key="item.id"
          v-bind:item="item"
        />
        <button v-if="user" slot="footer" v-on:click="addClick">
          <fa-icon icon="plus" /> New
        </button>
      </draggable>
      <button v-if="user" v-on:click="showUserMenu = !showUserMenu">
        <fa-icon icon="user" /> {{ account }}
      </button>
      <button
        v-if="showUserMenu"
        v-on:click="showUserMenu = false"
        class="hide-user-menu"
      />
      <span v-if="user && showUserMenu" class="user-menu">
        <button v-on:click="logoutClick">
          <fa-icon icon="sign-out-alt" /> Sign out
        </button>
        <button v-on:click="importClick">
          <fa-icon icon="upload" /> Import
        </button>
        <button v-on:click="exportClick">
          <fa-icon icon="download" /> Export
        </button>
        <button v-on:click="helpClick"><fa-icon icon="question" /> Help</button>
        <button
          v-for="themeId in themeOptions"
          v-bind:key="themeId"
          v-on:click="changeTheme(themeId)"
        >
          <logo v-bind:theme="themeValues(themeId)" class="theme-icon" />
          {{ themeId }}
        </button>
      </span>
      <router-link v-if="!user" to="/login">
        <fa-icon icon="sign-in-alt" /> Sign in
      </router-link>
    </nav>
    <router-view class="content" />
  </div>
</template>

<style lang="scss" scoped>
#app {
  @apply flex flex-col flex-1;
}
nav {
  @apply flex leading-none relative;
  a,
  button {
    @apply block px-3 py-2 cursor-pointer bg-rimbg text-rimfg text-left;
    &:hover {
      @apply bg-backlightbg text-backlightfg;
    }
    &.router-link-exact-active {
      @apply cursor-default text-backlightfg;
      background-color: transparent;
    }
  }
  button.hide-user-menu {
    @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
    background-color: #0004;
  }
}
span.user-menu {
  @apply absolute right-0 top-0 z-20 m-2 flex flex-col rounded overflow-hidden shadow;
  a,
  button {
    @apply bg-backlightbg text-backlightfg;
    &:hover {
      @apply bg-rimbg text-rimfg;
    }
  }
  svg.theme-icon {
    width: 1.2rem;
    height: 1.2rem;
    margin: -0.1rem;
    display: inline;
  }
}
div.shortcuts {
  @apply flex flex-1;
  ::v-deep .item {
    // Used in drag & drop
    @apply border-0;
    .title {
      @apply block p-2 bg-backlightbg text-backlightfg leading-none;
    }
    .body,
    .subitems,
    button {
      @apply hidden;
    }
  }
  &::after {
    @apply flex-1 bg-rimbg text-rimfg;
    content: '';
  }
}
div.content {
  @apply flex-1;
}
</style>
