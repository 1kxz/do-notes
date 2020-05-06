<template>
  <div v-bind:class="item.view">
    <header>
      <vue-markdown class="title" v-bind:source="content.title" />
      <button class="showNav" v-on:click="showNav = !showNav">
        <icon icon="ellipsis-h" />
      </button>
      <button class="hideNav" v-on:click="showNav = false" v-if="showNav" />
      <nav v-if="showNav">
        <router-link v-bind:to="viewUrl()">
          <icon icon="link" /> Permalink
        </router-link>
        <router-link v-bind:to="editUrl()">
          <icon icon="edit" /> Edit
        </router-link>
        <a v-on:click="addClick" v-if="subitems.length < 100">
          <icon icon="plus" /> Add note
        </a>
        <a v-on:click="deleteClick" v-if="subitems.length === 0">
          <icon icon="trash" /> Delete
        </a>
      </nav>
    </header>
    <vue-markdown
      class="body"
      v-if="content.body"
      v-bind:source="content.body"
    />
    <draggable
      tag="ul"
      group="items"
      class="subitems"
      handle="header"
      v-if="subitems.length > 0"
      v-bind:list="subitems"
      v-on:change="dragChange"
    >
      <li v-for="item in subitems" v-bind:key="item.id">
        <item v-bind:item="item" />
      </li>
    </draggable>
  </div>
</template>

<style lang="scss">
div.note,
div.board {
  @apply bg-soft border-hard border-2 rounded text-contrast;
  > header {
    @apply flex bg-hard relative leading-none;
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
      @apply flex flex-col bg-contrast rounded overflow-hidden absolute right-0 text-soft z-20 shadow py-1;
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
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
import { items, splitText, users } from '@/models/database';
import { moveItems } from '@/models/functions';
import Change from '@/models/Change';
import ItemData from '@/models/ItemData';
import router from '@/router/index';
import VueMarkdown from 'vue-markdown';
import Draggable from 'vuedraggable';

const Item = () => import('@/components/Item.vue');

@Component({ components: { Draggable, Icon, Item, VueMarkdown } })
export default class Note extends Vue {
  subitems = [];
  showNav = false;

  @Prop() private item!: ItemData;

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

  dragChange(change: Change) {
    const moved = change.moved;
    if (moved) {
      moveItems({
        parent: moved.element.parent?.id,
        old: moved.oldIndex,
        new: moved.newIndex
      }).then(console.log);
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
