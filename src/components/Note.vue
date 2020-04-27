<template>
  <div v-bind:class="item.view">
    <header>
      <vue-markdown
        class="title"
        v-if="content.title"
        v-bind:source="content.title"
      />
      <button class="showNav" v-on:click="showNav = !showNav">
        <font-awesome-icon icon="ellipsis-v" />
      </button>
      <button class="hideNav" v-on:click="showNav = false" v-if="showNav" />
      <nav v-if="showNav">
        <router-link v-bind:to="viewUrl()" v-if="false">
          <font-awesome-icon icon="link" /> Permalink
        </router-link>
        <router-link v-bind:to="editUrl()">
          <font-awesome-icon icon="edit" /> Edit
        </router-link>
        <a v-on:click="addClick">
          <font-awesome-icon icon="plus" /> New note
        </a>
        <a v-on:click="deleteClick" v-if="!subitems.length">
          <font-awesome-icon icon="trash" /> Delete
        </a>
      </nav>
    </header>
    <vue-markdown
      class="body"
      v-if="content.body"
      v-bind:source="content.body"
    />
    <ul v-if="subitems.length && depth" class="subitems">
      <li v-for="item in subitems" v-bind:key="item.id">
        <item v-bind:item="item" v-bind:depth="depth - 1" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
div.note,
div.board {
  @apply bg-soft border-hard border-2 rounded;
  > header {
    @apply flex bg-hard relative;
    > div.title {
      @apply flex-1 m-2;
    }
    > button.showNav {
      @apply p-2;
    }
    > button.hideNav {
      @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
    }
    > nav {
      @apply flex flex-col bg-contrast rounded overflow-hidden absolute right-0 text-soft z-20;
      > a {
        @apply p-2;
        &:hover {
          @apply bg-color cursor-pointer;
        }
      }
    }
  }
  > div.body {
    @apply m-2;
  }
  > ul.subitems {
    @apply flex flex-col m-1;
    > li {
      @apply flex-1 m-1;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueMarkdown from 'vue-markdown';
import splitText from '@/notes';
import { db } from '@/db';
import router from '@/router/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faEllipsisV,
  faLink,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const Item = () => import('@/components/Item.vue');

class ItemData {
  id!: string;
  text!: string;
  owner!: string;
  view!: string;
}

const items = db.collection('items');
const users = db.collection('users');

library.add(faEdit, faEllipsisV, faLink, faPlus, faTrash);

@Component({ components: { FontAwesomeIcon, Item, VueMarkdown } })
export default class Note extends Vue {
  subitems = [];
  showNav = false;

  @Prop() private item!: ItemData;
  @Prop() private depth!: number;

  get content() {
    return splitText(this.item.text);
  }

  get icon() {
    switch (this.item.view) {
      case 'note':
        return 'sticky-note';
      case 'board':
        return 'columns';
      default:
        return 'link';
    }
  }

  viewUrl() {
    return { name: 'Viewer', params: { id: this.item.id } };
  }

  editUrl() {
    return { name: 'Editor', params: { id: this.item.id } };
  }

  addClick() {
    console.log(this.item.owner);
    items
      .add({
        text: 'New',
        view: 'note',
        parent: items.doc(this.item.id),
        owner: users.doc('Sys9gLK44wJRytsgYAbt'),
        order: this.subitems ? this.subitems.length : 0
      })
      .then(x => router.push({ name: 'Editor', params: { id: x.id } }));
  }

  deleteClick() {
    if (this.subitems.length == 0) {
      items.doc(this.item.id).delete();
    }
  }

  mounted() {
    const subitems = items
      .where('parent', '==', items.doc(this.item.id))
      .orderBy('order');
    this.$bind('subitems', subitems);
  }
}
</script>
