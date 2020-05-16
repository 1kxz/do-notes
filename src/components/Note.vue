<template>
  <div
    v-bind:class="[
      'note',
      item.noteOrientation,
      item.parent ? '' : 'root',
      content.body ? '' : 'ghost'
    ]"
  >
    <header>
      <vue-markdown
        v-if="item.parent && content.title"
        v-bind:source="content.title"
        class="title"
      />
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
        <a
          v-on:click="horizontalClick"
          v-if="item.view === 'note' && item.noteOrientation === 'vertical'"
        >
          <fa-icon icon="columns" /> View as board
        </a>
        <a
          v-on:click="verticalClick"
          v-if="item.view === 'note' && item.noteOrientation === 'horizontal'"
        >
          <fa-icon icon="stream" /> View as list
        </a>
      </nav>
    </header>
    <vue-markdown
      class="body text"
      v-if="content.body"
      v-bind:source="content.body"
    />
    <draggable
      group="items"
      class="subitems"
      handle="header"
      v-if="subitems.length > 0"
      v-bind:list="dragmodel"
      v-on:change="dragChange"
    >
      <item v-for="item in subitems" v-bind:key="item.id" v-bind:item="item" />
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
div.note {
  @apply relative;
  header {
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
      @apply absolute right-0 top-0 z-20 flex flex-col bg-contrast text-soft rounded overflow-hidden shadow;
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
  > div.subitems {
    @apply flex flex-col m-1;
    > div {
      @apply flex-1 m-1 rounded;
    }
  }
}
div.note:not(.root) {
  @apply bg-soft text-contrast border-2 border-hard;
  header {
    > div.title {
      @apply bg-hard;
    }
    > button.showNav {
      @apply bg-hard rounded-bl;
    }
  }
}
div.note.root.ghost {
  @apply pr-6;
}
div.note.vertical {
  > div.subitems {
    @apply flex-col;
  }
}
div.note.horizontal {
  > div.subitems {
    @apply flex-row;
  }
}
</style>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { items, splitText } from '@/models/database';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import Change from '@/models/Change';
import Draggable from 'vuedraggable';
import ItemData from '@/models/ItemData';
import router from '@/router/index';
import VueMarkdown from 'vue-markdown';

const Item = () => import('@/components/Item.vue');

@Component({ components: { Draggable, FaIcon, Item, VueMarkdown } })
export default class Note extends Vue {
  subitems: ItemData[] = [];
  showNav = false;

  @Prop() private item!: ItemData;

  get content() {
    return splitText(this.item.text);
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
        parent: items.doc(this.item.id),
        order: this.subitems ? this.subitems.length : 0,
        text: 'New',
        view: 'note',
        noteOrientation: 'vertical'
      })
      .then(x => router.push({ name: 'Editor', params: { id: x.id } }));
  }

  deleteClick() {
    if (this.subitems.length == 0) {
      items.doc(this.item.id).delete();
    }
  }

  horizontalClick() {
    items.doc(this.item.id).update({ noteOrientation: 'horizontal' });
  }

  verticalClick() {
    items.doc(this.item.id).update({ noteOrientation: 'vertical' });
  }

  dragChange(change: Change) {
    if (change.added) {
      itemAdd({
        parentId: this.item.id,
        itemId: change.added.element,
        index: change.added.newIndex
      });
    } else if (change.moved) {
      itemMove({
        parentId: this.item.id,
        oldIndex: change.moved.oldIndex,
        newIndex: change.moved.newIndex
      });
    } else if (change.removed) {
      itemRemove({
        parentId: this.item.id,
        itemId: change.removed.element,
        index: change.removed.oldIndex
      });
    }
  }

  @Watch('item', { immediate: true })
  onItemChanged() {
    const subitems = items
      .where('uid', '==', this.item.uid)
      .where('parent', '==', items.doc(this.item.id))
      .orderBy('order');
    this.$bind('subitems', subitems);
  }
}
</script>
