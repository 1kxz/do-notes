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
      this.$bind('subitems', subitems).then(() => {
        Prism.highlightAll();
      });
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

  collapseClick(value: boolean) {
    this.showNav = false;
    items.doc(this.item.id).update({ collapsed: value });
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
      item.title ? 'has-title' : 'untitled',
      item.content ? 'has-content' : 'contentless',
      item.parent ? 'has-parent' : 'orphan',
      item.collapsed ? 'collapsed' : 'expanded',
      subitems.length ? 'has-length' : 'empty',
      root ? 'root' : 'nonroot'
    ]"
  >
    <header>
      <div v-if="!root && item.title" class="title">
        {{ item.title }}
      </div>
      <button v-on:click="showNav = !showNav" class="show-nav">
        <fa-icon icon="ellipsis-h" />
      </button>
      <button
        v-if="item.collapsed && (item.content || subitems.length)"
        v-on:click="collapseClick(false)"
        class="expand"
      >
        <span v-if="subitems.length">{{ subitems.length }}</span>
        <fa-icon icon="plus-circle" />
      </button>
      <button v-if="showNav" v-on:click="showNav = false" class="hide-nav" />
      <nav v-if="showNav">
        <router-link v-bind:to="editUrl">
          <fa-icon icon="edit" /> Edit
        </router-link>
        <a v-on:click="addClick" v-if="subitems.length < 100">
          <fa-icon icon="plus" /> Add sub-note
        </a>
        <a v-on:click="collapseClick(false)" v-if="item.collapsed">
          <fa-icon icon="plus-circle" /> Expand
        </a>
        <a v-on:click="collapseClick(true)" v-else>
          <fa-icon icon="minus-circle" /> Collapse
        </a>
        <a v-on:click="deleteClick" v-if="subitems.length === 0">
          <fa-icon icon="trash" /> Delete
        </a>
        <a v-on:click="viewClick('pad')" v-if="item.view !== 'pad'">
          <fa-icon icon="file-alt" /> Notepad view
        </a>
        <a v-on:click="viewClick('wide')" v-if="item.view !== 'wide'">
          <fa-icon icon="th-large" /> Album view
        </a>
        <a v-on:click="viewClick('board')" v-if="item.view !== 'board'">
          <fa-icon icon="columns" /> Board view
        </a>
        <a v-on:click="viewClick('tabs')" v-if="item.view !== 'tab'">
          <fa-icon icon="folder" /> Tabs view
        </a>
      </nav>
    </header>
    <section v-if="!item.collapsed">
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
        v-bind:class="[
          'subitems',
          subitems.length > 0 ? 'has-length' : 'empty'
        ]"
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
  // border: 2px solid #00f !important;
  > section {
    > div.subitems {
      @apply flex flex-col;
      > div.item {
        max-width: 60rem;
      }
    }
  }
}
div.item.board {
  // border: 2px solid #0f0 !important;
  @apply flex flex-col;
  > section {
    @apply flex-1;
    > div.subitems {
      @apply flex;
      height: 100%;
      align-items: flex-start;
      overflow-x: auto;
      > div.item.expanded {
        min-width: 24rem;
        max-width: 40rem;
      }
      > div.item.collapsed > header {
        @apply flex flex-col pr-4;
      }
    }
  }
  div.text {
    max-height: 32em;
    overflow-y: auto;
  }
}
div.item.wide {
  // border: 2px solid #f00 !important;
  > section {
    > div.subitems {
      @apply flex flex-row items-start justify-start flex-wrap;
      > div.item {
        min-width: 30rem;
        max-width: calc(50% - 1em);
      }
    }
  }
  div.text {
    max-height: 60em;
    overflow-y: auto;
  }
}
// Content layout
div.item {
  > header {
    @apply leading-tight flex p-1 relative;
    > div.title {
      @apply p-1 flex-1;
    }
    > button.expand {
      @apply p-1;
      span {
        @apply pr-1;
      }
    }
    > button.hide-nav {
      @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
      background-color: #0004;
    }
    > nav {
      @apply absolute right-0 top-0 z-20 flex flex-col;
      min-width: 9rem;
      > a {
        @apply p-2;
      }
    }
  }
  > section {
    > div.text + div.subitems.has-length {
      @apply -mt-2;
    }
    > div.subitems.has-length {
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
div.item.root {
  @apply relative;
  > header {
    @apply absolute right-0;
    min-height: 2em;
    min-width: 2.2em;
  }
}
div.item.root.contentless {
  // Fix header options overlap
  @apply pr-10;
}
div.item.root.board {
  // Fix column margins in board view
  > section > div.subitems > div.item {
    @apply -m-1 mt-1;
    > header > button.show-nav {
      margin-right: calc(0.5em + 2px);
    }
  }
}
div.item.root.orphan.empty {
  // Applies to root notes in the editor
  @apply pr-8;
}
// Color & style
div.item {
  > header {
    > button.show-nav {
      @apply hidden;
      &:hover {
        @apply block opacity-100;
      }
    }
    &:hover {
      > .show-nav {
        @apply block opacity-50;
      }
    }
    > nav {
      @apply bg-backlightbg text-backlightfg rounded overflow-hidden shadow;
      a:hover {
        @apply bg-rimbg text-rimfg cursor-pointer no-underline;
      }
    }
  }
  > section {
    > div.subitems > div.item {
      @apply rounded;
    }
    > div.text::v-deep {
      a {
        @apply text-keybg;
      }
      img {
        @apply block mx-auto;
        width: 100%;
      }
      h1 {
        @apply bg-keybg;
      }
      h2 {
        @apply border-b-2 border-keybg;
      }
    }
  }
}
div.viewer div.item.nonroot,
div.item.root.pad div.item,
div.item.root.wide div.item,
div.item.root div.item div.item {
  @apply bg-highlightbg text-highlightfg border-2 border-keybg;
  > header {
    @apply bg-keybg text-keyfg cursor-default;
  }
  > section {
    > div.text::v-deep a {
      @apply text-rimbg;
    }
  }
}
div.item.untitled {
  > header {
    @apply float-right;
    min-height: 2em;
    min-width: 2.2em;
    > button.show-nav {
      @apply leading-none;
    }
  }
  &.expanded > header {
    @apply rounded-bl;
  }
}
// Prototyping tabbed items
div.item.tabs > section {
  position: relative;
  height: 100%;
  > div.subitems {
    @apply flex flex-row p-0;
    @apply bg-rimbg text-rimfg mt-1 rounded-r;
    width: 100%;
    > div.item {
      @apply m-0;
      > header {
        > button.show-nav {
          display: block;
          opacity: 25%;
          @apply p-1;
        }
      }
      > section {
        display: none;
      }
      &:hover {
        @apply text-backlightfg;
        height: 100%;
        > header {
          @apply bg-backlightbg text-backlightfg;
          > button.show-nav:hover {
            opacity: 100%;
          }
        }
        > section {
          display: block;
          position: absolute;
          left: 0;
          top: 2.2em;
          right: 0;
        }
      }
    }
  }
}
</style>
