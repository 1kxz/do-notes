<template>
  <div
    v-bind:class="[
      'item',
      item.view,
      item.title ? 'headed' : 'headless',
      item.content ? 'full' : 'empty',
      root && !item.parent ? 'transparent' : 'solid'
    ]"
  >
    <header>
      <div v-if="!root && item.title" class="title">{{ item.title }}</div>
      <button v-on:click="showNav = !showNav" class="show-nav">
        <fa-icon icon="ellipsis-h" />
      </button>
      <button v-if="showNav" v-on:click="showNav = false" class="hide-nav" />
      <nav v-if="showNav">
        <a v-on:click="addClick" v-if="subitems.length < 100">
          <fa-icon icon="plus" /> Add sub-note
        </a>
        <router-link v-bind:to="editUrl">
          <fa-icon icon="edit" /> Edit
        </router-link>
        <a v-on:click="deleteClick" v-if="subitems.length === 0">
          <fa-icon icon="trash" /> Delete
        </a>
        <a v-on:click="boardClick" v-if="item.view === 'pad'">
          <fa-icon icon="columns" /> View as board
        </a>
        <a v-on:click="padClick" v-if="item.view === 'board'">
          <fa-icon icon="stream" /> View as list
        </a>
      </nav>
    </header>
    <component
      class="body text"
      v-if="item.content"
      v-bind:source="item.content"
      v-bind:title="item.title"
      v-bind:is="type"
    />
    <draggable
      group="items"
      handle="header"
      v-bind:class="['subitems', subitems.length > 0 ? 'full' : 'empty']"
      v-bind:list="dragmodel"
      v-on:change="dragChange"
    >
      <item-viewer
        v-for="item in subitems"
        v-bind:key="item.id"
        v-bind:item="item"
      />
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
// Nesting layout
div.item {
  @apply flex flex-col;
}
div.item.pad {
  // border: 2px solid #00f;
  > div.subitems {
    @apply flex flex-col;
    > div.item {
    }
  }
}
div.item.board {
  // border: 2px solid #0f0;
  > div.subitems {
    @apply flex flex-row items-start justify-center;
    > div.item {
    }
  }
}
div.item.transparent {
  > div.subitems > div {
    min-width: 20rem;
    max-width: 60rem;
  }
}
// Note layout
div.item {
  @apply relative;
  > header {
    @apply leading-tight;
    > div.title {
      @apply p-2 pr-8;
    }
    > button.show-nav {
      @apply absolute top-0 right-0 p-2;
    }
    > button.hide-nav {
      @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
      background-color: #0004;
    }
    > nav {
      @apply absolute right-0 top-0 z-20 flex flex-col;
      > a {
        @apply p-2;
      }
    }
  }
  > div.body + div.subitems.full {
    @apply -mt-2;
  }
  > div.subitems.full {
    @apply p-1;
    > div {
      @apply m-1;
    }
    // background: repeating-linear-gradient(
    //   -45deg,
    //   #0000,
    //   #0000 10px,
    //   #f004 10px,
    //   #f004 20px
    // );
  }
  > div.subitems.empty {
    @apply -mt-2 pt-2;
    > div {
      @apply m-2;
    }
    // background: repeating-linear-gradient(
    //   -45deg,
    //   #0000,
    //   #0000 10px,
    //   #0004 10px,
    //   #0004 20px
    // );
  }
}
div.item.transparent.empty {
  @apply pr-6;
}
// Color & style
div.item {
  > header {
    @apply cursor-default;
    > nav {
      @apply bg-backlightbg text-backlightfg rounded overflow-hidden shadow;
      a:hover {
        @apply bg-rimbg text-rimfg cursor-pointer;
      }
    }
  }
  > div.subitems > div.item {
    @apply rounded;
  }
  > div.text {
    ::v-deep a {
      @apply text-keybg;
    }
  }
}
div.item.solid {
  @apply bg-highlightbg text-highlightfg border-2 border-keybg;
  > header {
    @apply bg-keybg text-keyfg;
  }
  > div.text {
    ::v-deep a {
      @apply text-rimbg;
    }
  }
}
div.item.solid.headless {
  > header {
    > button.show-nav {
      @apply rounded-bl leading-none;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import { items } from '@/models/database';
import Change from '@/models/Change';
import Draggable from 'vuedraggable';
import Item from '@/models/Item';
import Picture from '@/components/Picture.vue';
import Prism from 'prismjs';
import router from '@/router/index';
import VueMarkdown from 'vue-markdown';

import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-python.min';

@Component({ components: { Draggable, FaIcon } })
export default class ItemViewer extends Vue {
  subitems: Item[] = [];
  showNav = false;

  @Prop() private item!: Item;
  @Prop(Boolean) private root!: boolean;

  get type() {
    switch (this.item.format) {
      case 'markdown':
        return VueMarkdown;
      case 'data:image/png;base64':
        return Picture;
      default:
        throw `invalid format ${this.item.format}`;
    }
  }

  get dragmodel() {
    return this.subitems.map(item => item.id);
  }

  get editUrl() {
    return { name: 'Editor', params: { id: this.item.id } };
  }

  addClick() {
    items
      .add({
        uid: this.item.uid,
        parent: this.item.id,
        order: this.subitems ? this.subitems.length : 0,
        title: 'New document',
        content: 'Hello world!',
        format: 'markdown',
        view: 'pad'
      })
      .then(x => router.push({ name: 'Editor', params: { id: x.id } }));
  }

  deleteClick() {
    if (this.subitems.length == 0) {
      items.doc(this.item.id).delete();
    }
  }

  boardClick() {
    this.showNav = false;
    items.doc(this.item.id).update({ view: 'board' });
  }

  padClick() {
    this.showNav = false;
    items.doc(this.item.id).update({ view: 'pad' });
  }

  dragChange(change: Change) {
    if (change.added) {
      itemAdd({
        uid: this.item.uid,
        parentId: this.item.id,
        itemId: change.added.element,
        newIndex: change.added.newIndex
      });
    } else if (change.moved) {
      itemMove({
        uid: this.item.uid,
        parentId: this.item.id,
        oldIndex: change.moved.oldIndex,
        newIndex: change.moved.newIndex
      });
    } else if (change.removed) {
      itemRemove({
        uid: this.item.uid,
        parentId: this.item.id,
        itemId: change.removed.element,
        oldIndex: change.removed.oldIndex
      });
    }
  }

  @Watch('item', { immediate: true })
  onItemChanged() {
    if (this.item.uid && this.item.id) {
      const subitems = items
        .where('uid', '==', this.item.uid)
        .where('parent', '==', this.item.id)
        .orderBy('order');
      this.$bind('subitems', subitems);
      Prism.highlightAll();
    }
  }
}
</script>
