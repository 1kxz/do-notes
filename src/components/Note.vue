<template>
  <div v-bind:class="['note', item.view]">
    <header>
      <vue-markdown
        v-if="content.title"
        v-bind:source="content.title"
        class="title"
      />
      {{ item.id }} [{{ item.order }}]
      <button class="showNav" v-on:click="showNav = !showNav">
        <icon icon="ellipsis-h" />
      </button>
      <button v-if="showNav" v-on:click="showNav = false" class="hideNav" />
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
      handle=".title"
      v-if="subitems.length > 0"
      v-bind:list="dragmodel"
      v-on:change="dragChange"
    >
      <li v-for="item in subitems" v-bind:key="item.id">
        <item v-bind:item="item" />
      </li>
    </draggable>
  </div>
</template>

<style lang="scss" scoped>
div.note {
  @apply relative;
  header {
    @apply leading-tight;
    > div.title {
      @apply p-2;
    }
    > button.showNav {
      @apply absolute top-0 right-0 p-2;
    }
    > button.hideNav {
      @apply fixed h-full w-full top-0 right-0 bottom-0 left-0 z-10;
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
  > ul.subitems {
    @apply flex flex-col m-1;
    > li {
      @apply flex-1 m-1;
    }
  }
}
div.note:not(.root) {
  @apply bg-soft text-contrast border-2 border-hard rounded;
  header {
    > div.title {
      @apply bg-hard;
    }
    > button.showNav {
      @apply bg-hard rounded-bl;
    }
  }
}
div.pad {
  > ul.subitems {
    @apply flex-col;
  }
}
div.board {
  > ul.subitems {
    @apply flex-row;
  }
}
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FontAwesomeIcon as Icon } from '@fortawesome/vue-fontawesome';
import { items, splitText, users } from '@/models/database';
import { itemAdd, itemMove, itemRemove } from '@/models/functions';
import Change from '@/models/Change';
import ItemData from '@/models/ItemData';
import router from '@/router/index';
import VueMarkdown from 'vue-markdown';
import Draggable from 'vuedraggable';

const Item = () => import('@/components/Item.vue');

@Component({ components: { Draggable, Icon, Item, VueMarkdown } })
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
        view: 'pad',
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
    if (change.added) {
      itemAdd({
        parent: this.item.id,
        item: change.added.element,
        index: change.added.newIndex
      }).then(console.log);
    } else if (change.moved) {
      itemMove({
        parent: this.item.id,
        old: change.moved.oldIndex,
        new: change.moved.newIndex
      }).then(console.log);
    } else if (change.removed) {
      itemRemove({
        parent: this.item.id,
        item: change.removed.element,
        index: change.removed.oldIndex
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
