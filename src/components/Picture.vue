<template>
  <div>
    <img v-if="item" v-bind:src="item.content" v-bind:title="item.title" />
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import Item from '@/models/Item';
import Prism from 'prismjs';

@Component
export default class Picture extends Vue {
  @Prop() private item!: Item;

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
