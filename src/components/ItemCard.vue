<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { itemAdd, itemMove, itemRemove } from '@/functions';
import { items } from '@/database';
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

@Component({ name: 'ItemCard', components: { Draggable, FaIcon } })
export default class ItemCard extends Vue {
  subitems: Item[] = [];
  showNav = false;

  @Prop() private item!: Item;
  @Prop(Boolean) private root!: boolean;

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

  get type() {
    switch (this.item.format) {
      case 'markdown':
        return VueMarkdown;
      case 'image':
        return Picture;
      default:
        throw `invalid format ${this.item.format}`;
    }
  }

  get editUrl() {
    return { name: 'ItemEdit', params: { id: this.item.id } };
  }

  addClick() {
    items
      .add({
        uid: this.item.uid,
        parent: this.item.id,
        order: this.subitems ? this.subitems.length : 0,
        title: 'New document',
        content: 'Hello world!',
        created: new Date(),
        format: 'markdown',
        view: 'pad'
      })
      .then(x => router.push({ name: 'ItemEdit', params: { id: x.id } }));
  }

  deleteClick() {
    if (this.subitems.length == 0) {
      items.doc(this.item.id).delete();
    }
  }

  viewClick(value: string) {
    this.showNav = false;
    items.doc(this.item.id).update({ view: value });
  }

  get dragmodel() {
    return this.subitems.map(item => item.id);
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
}
</script>

<template>
  <div
    v-bind:class="[
      'item',
      item.view,
      item.format,
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
        <router-link v-bind:to="editUrl">
          <fa-icon icon="edit" /> Edit
        </router-link>
        <a v-on:click="addClick" v-if="subitems.length < 100">
          <fa-icon icon="plus" /> Add sub-note
        </a>
        <a v-on:click="deleteClick" v-if="subitems.length === 0">
          <fa-icon icon="trash" /> Delete
        </a>
        <a v-on:click="viewClick('pad')" v-if="item.view !== 'pad'">
          <fa-icon icon="file-alt" /> Pad view
        </a>
        <a v-on:click="viewClick('board')" v-if="item.view !== 'board'">
          <fa-icon icon="columns" /> Board view
        </a>
        <a v-on:click="viewClick('wide')" v-if="item.view !== 'wide'">
          <fa-icon icon="book-open" /> Wide view
        </a>
      </nav>
    </header>
    <section>
      <component
        class="text"
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
        <item-card
          v-for="subitem in subitems"
          v-bind:key="subitem.id"
          v-bind:item="subitem"
        />
      </draggable>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Nesting layout
div.item.pad {
  // border: 2px solid #00f;
  > section {
    > div.subitems {
      @apply flex flex-col;
      > div.item {
        max-width: 65rem;
      }
    }
  }
}
div.item.board {
  // border: 2px solid #0f0;
  display: flex;
  flex-direction: column;
  > section {
    flex: 1;
    > div.subitems {
      height: 100%;
      display: flex;
      align-items: flex-start;
      overflow-x: auto;
      > div.item {
        min-width: 20rem;
        max-width: 30rem;
      }
    }
  }
}
div.item.wide {
  // border: 2px solid #f00;
  > section > div.subitems {
    @apply flex flex-row items-start justify-start flex-wrap;
    > div.item {
      min-width: 30rem;
      max-width: 65rem;
    }
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
  > section {
    > div.text + div.subitems.full {
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
}
div.item.transparent.empty {
  @apply pr-8;
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
  > section {
    > div.subitems > div.item {
      @apply rounded;
    }
    > div.text::v-deep a {
      @apply text-keybg;
    }
  }
  img {
    @apply mx-auto;
    max-height: 15rem;
    &:hover {
      @apply z-10;
      transform: scale(2.5);
    }
  }
}
div.item.solid {
  @apply bg-highlightbg text-highlightfg border-2 border-keybg;
  > header {
    @apply bg-keybg text-keyfg;
  }
  > section {
    > div.text::v-deep a {
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
