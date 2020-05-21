<template>
  <div id="app">
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
          Use {{ themeId }} theme
        </button>
      </span>
      <router-link v-if="!user" to="/login">
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
    @apply flex leading-none relative;
    a,
    button {
      @apply block px-3 py-2 cursor-pointer;
    }
    a,
    button {
      @apply bg-color text-left;
      &:hover {
        @apply bg-contrast;
      }
      &.router-link-exact-active {
        @apply cursor-default;
        background-color: transparent;
      }
    }
    button.hide-user-menu {
      @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
      background-color: #0004;
    }
    span.user-menu {
      @apply absolute right-0 top-0 z-20 m-2 flex flex-col bg-contrast text-soft rounded overflow-hidden shadow;
      a,
      button {
        @apply bg-contrast;
        &:hover {
          @apply bg-color;
        }
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
      &::after {
        @apply flex-1 bg-color;
        content: '';
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
import Item from '@/models/Item';
import ItemLink from '@/components/ItemLink.vue';
import User from '@/models/User';

@Component({ components: { Draggable, FaIcon, ItemLink } })
export default class App extends Vue {
  user: User | null = null;
  subitems: Item[] = [];
  showUserMenu = false;
  currentThemeId = 'default';
  themes: { [key: string]: { [key: string]: string } } = {
    default: {
      soft: '#eff3f4',
      hard: '#b3d4e5',
      color: '#336699',
      contrast: '#0f1f3f',
      background: 'none'
    },
    spring: {
      soft: '#fcfbf7',
      hard: '#dff28a',
      color: '#960954',
      contrast: '#2b1d1f',
      background: 'url("../symphony.png")'
    },
    summer: {
      soft: '#f8f0e8',
      hard: '#ffcd6c',
      color: '#00709e',
      contrast: '#00223d',
      background: 'url("../seigaiha.png")'
    },
    autumn: {
      soft: '#f7efde',
      hard: '#fcc37e',
      color: '#9b1403',
      contrast: '#2d1d26',
      background: 'url("../vichy.png")'
    },
    winter: {
      soft: '#f4fbff',
      hard: '#b0daf2',
      color: '#6d0dbe',
      contrast: '#19162b',
      background: 'url("../escheresque.png")'
    }
  };

  get dragModel() {
    return this.subitems.map(item => item.id);
  }

  get account() {
    return this.user?.name || this.user?.email || 'Unknown';
  }

  mounted() {
    this.changeTheme(this.themeOptions[Math.floor(Math.random() * 4)]);
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

  get themeOptions() {
    const themes: string[] = [];
    for (const theme in this.themes) {
      if (theme != this.currentThemeId) {
        themes.push(theme);
      }
    }
    return themes;
  }

  changeTheme(themeId: string) {
    const values = this.themes[themeId];
    for (const key in values) {
      document.documentElement.style.setProperty(`--${key}`, values[key]);
    }
    this.currentThemeId = themeId;
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
          text: 'New',
          view: 'board'
        })
        .then(x => this.$router.push({ name: 'Editor', params: { id: x.id } }));
    }
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
