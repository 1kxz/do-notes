<template>
  <div v-bind:class="item.view">
    <header>
      <a v-on:click="deleteClick" v-if="!subitems.length">x</a>
      <a v-on:click="addClick">+</a>
      <router-link v-bind:to="editUrl()">=</router-link>
      <router-link v-bind:to="viewUrl()">#</router-link>
      <vue-markdown
        class="title"
        v-if="content.title"
        v-bind:source="content.title"
      ></vue-markdown>
    </header>
    <vue-markdown
      class="body"
      v-if="content.body"
      v-bind:source="content.body"
    ></vue-markdown>
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
  @apply rounded;
  @apply bg-soft;
  @apply border-2;
  @apply border-hard;
  > header {
    > div.title {
      @apply bg-hard;
      @apply p-2;
    }
    > a {
      @apply p-2;
      float: right;
      display: none;
      cursor: pointer;
    }
    &:hover > a {
      display: block;
    }
  }
  > div.body {
    @apply p-2;
  }
  > ul.subitems {
    @apply flex;
    @apply flex-col;
    @apply p-1;
    > li {
      @apply flex-1;
      @apply m-1;
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

const Item = () => import('@/components/Item.vue');

class ItemData {
  id!: string;
  text!: string;
  owner!: string;
}

const items = db.collection('items');
const users = db.collection('users');

@Component({ components: { Item, VueMarkdown } })
export default class Note extends Vue {
  subitems = [];

  @Prop() private item!: ItemData;
  @Prop() private depth!: number;

  get content() {
    return splitText(this.item.text);
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
