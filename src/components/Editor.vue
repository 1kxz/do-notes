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
    min-height: 25rem;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import { Route } from 'vue-router';
import { ThrottleSetter } from 'lodash-decorators';
import Item from '@/components/Item.vue';
import ItemData from '@/models/ItemData';

@Component({ components: { Item } })
export default class TaskView extends Vue {
  item: ItemData | null = null;

  get text() {
    return this.item?.text;
  }

  @ThrottleSetter(1000)
  set text(value) {
    items.doc(this.$route.params.id).update({ text: value });
  }

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    this.$bind('item', items.doc(route.params.id));
  }
}
</script>
