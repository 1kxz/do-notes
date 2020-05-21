<template>
  <img v-if="item" v-bind:src="content.body" />
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { items, splitText } from '@/models/database';
import Item from '@/models/Item';
import Prism from 'prismjs';

@Component
export default class Picture extends Vue {
  @Prop() private item!: Item;

  get content() {
    return splitText(this.item.text);
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
