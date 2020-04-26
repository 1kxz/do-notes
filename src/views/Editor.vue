<template>
  <div v-if="item" class="editor">
    <textarea v-model="text"></textarea>
    <item v-bind:item="item" v-bind:depth="0" />
  </div>
</template>

<style lang="scss" scoped>
div.editor {
  @apply flex;
  > * {
    @apply flex-1;
    @apply m-1;
  }
  > textarea {
    @apply p-2;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/db';
import Item from '@/components/Item.vue';
import VueMarkdown from 'vue-markdown';
import { ThrottleSetter } from 'lodash-decorators';

class ItemData {
  id!: string;
  text!: string;
}

const items = db.collection('items');

@Component({ components: { Item, VueMarkdown } })
export default class TaskView extends Vue {
  item: ItemData | null = null;

  get id() {
    return this.$route.params.id;
  }

  get text() {
    return this.item?.text;
  }

  @ThrottleSetter(1000)
  set text(value) {
    items
      .doc(this.id)
      .update({ text: value })
      .then(() => console.log('updated!'));
  }

  mounted() {
    this.$bind('item', items.doc(this.id));
  }
}
</script>
