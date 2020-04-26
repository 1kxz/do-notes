<template>
  <div class="note">
    <router-link v-bind:to="editUrl()" class="permalink">#</router-link>
    <header>
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
    <ul v-if="depth > 0">
      <li v-for="item in subitems" v-bind:key="item.id">
        <item v-bind:item="item" v-bind:depth="depth - 1" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.note {
  @apply m-2;
  @apply rounded;
  @apply bg-soft;
  @apply border;
  @apply border-hard;
  overflow: hidden;
  .permalink {
    float: right;
    @apply p-2;
  }
  .title {
    @apply bg-hard;
    @apply p-2;
  }
  .body {
    @apply p-2;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VueMarkdown from 'vue-markdown';
import splitText from '@/notes';
import { db } from '@/db';

const Item = () => import('@/components/Item.vue');

class ItemData {
  id!: string;
  text!: string;
}

const items = db.collection('items');

@Component({ components: { Item, VueMarkdown } })
export default class Note extends Vue {
  subitems = [];

  @Prop() private item!: ItemData;
  @Prop() private depth!: number;

  get content() {
    return splitText(this.item.text);
  }

  editUrl() {
    return { name: 'Editor', params: { id: this.item.id } };
  }

  mounted() {
    const subitems = items
      .where('parent', '==', items.doc(this.item.id))
      .orderBy('order');
    this.$bind('subitems', subitems);
  }
}
</script>
