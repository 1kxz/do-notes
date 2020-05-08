<template>
  <div v-if="item" class="editor">
    <textarea v-model="text"></textarea>
    <item v-bind:item="item" />
  </div>
</template>

<style lang="scss" scoped>
div.editor {
  @apply flex;
  > * {
    @apply flex-1;
  }
  > textarea {
    @apply p-2 text-contrast;
  }
  > div.item {
    @apply m-2;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/database';
import { ThrottleSetter } from 'lodash-decorators';
import Item from '@/components/Item.vue';
import ItemData from '@/models/ItemData';

@Component({ components: { Item } })
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
    items.doc(this.id).update({ text: value });
  }

  mounted() {
    this.$bind('item', items.doc(this.id));
  }
}
</script>
