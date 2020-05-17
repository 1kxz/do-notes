<template>
  <div
    v-bind:class="[
      'note',
      item.orientation,
      root && !item.parent ? 'transparent' : 'solid',
      content.body ? 'full' : 'empty',
      content.header ? 'headed' : 'headless'
    ]"
  >
    <header>
      <vue-markdown
        v-if="!root && content.title"
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
          v-if="item.view === 'note' && item.orientation === 'vertical'"
        >
          <fa-icon icon="columns" /> View as board
        </a>
        <a
          v-on:click="verticalClick"
          v-if="item.view === 'note' && item.orientation === 'horizontal'"
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
div.note {
  @apply relative;
  > header {
    @apply leading-tight cursor-default;
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
  > div.body + div.subitems.full {
    @apply -mt-2;
  }
  > div.subitems.full {
    @apply p-1;
    > div {
      @apply m-1 rounded;
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
      @apply m-2 rounded;
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
div.note.solid {
  @apply bg-soft text-contrast border-2 border-hard;
  > header {
    > div.title {
      @apply bg-hard;
    }
    > button.showNav {
      @apply bg-hard rounded-bl;
    }
  }
}
div.note.transparent {
  > div.subitems > div {
    min-width: 20rem;
    max-width: 60rem;
  }
}
div.note.transparent.empty {
  @apply pr-6;
}
div.note.vertical {
  @apply flex flex-col;
  // border: 2px solid #00f;
  > div.subitems {
    @apply flex-1 flex flex-col;
    > div.note.full {
      @apply flex-1;
    }
  }
}
div.note.horizontal {
  // border: 2px solid #0f0;
  > div.subitems {
    @apply flex flex-row flex-wrap;
    > div.note {
      @apply flex-auto;
    }
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
import Item from '@/models/Item';
import router from '@/router/index';
import VueMarkdown from 'vue-markdown';

const ItemViewer = () => import('@/components/ItemViewer.vue');

@Component({ components: { Draggable, FaIcon, ItemViewer, VueMarkdown } })
export default class Note extends Vue {
  subitems: Item[] = [];
  showNav = false;

  @Prop() private item!: Item;
  @Prop(Boolean) private root!: boolean;

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
        parent: this.item.id,
        order: this.subitems ? this.subitems.length : 0,
        text: 'New',
        format: 'markdown',
        view: 'note',
        orientation: 'vertical'
      })
      .then(x => router.push({ name: 'Editor', params: { id: x.id } }));
  }

  deleteClick() {
    if (this.subitems.length == 0) {
      items.doc(this.item.id).delete();
    }
  }

  horizontalClick() {
    items.doc(this.item.id).update({ orientation: 'horizontal' });
  }

  verticalClick() {
    items.doc(this.item.id).update({ orientation: 'vertical' });
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
    }
  }
}
</script>
