<template>
  <div v-if="item" v-bind:class="['editor', synced ? 'synced' : 'outdated']">
    <textarea v-model="text"></textarea>
    <item-viewer v-bind:item="item" v-bind:root="item.parent == null" />
  </div>
</template>

<style lang="scss" scoped>
div.editor {
  @apply flex flex-1;
  > * {
    @apply flex-1;
  }
  > textarea {
    @apply p-2 text-contrast;
  }
}
div.editor.outdated > div.item {
  @apply opacity-75;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items, splitText } from '@/models/database';
import { Route } from 'vue-router';
import { Throttle } from 'lodash-decorators';
import ItemViewer from '@/components/ItemViewer.vue';
import Item from '@/models/Item';

@Component({ components: { ItemViewer } })
export default class Editor extends Vue {
  id: string | null = null;
  item: Item | null = null;
  synced = false;

  get text() {
    if (this.item) {
      return this.item.title + '\n' + this.item.content;
    }
    return '';
  }

  set text(value: string) {
    if (this.item) {
      this.synced = false;
      const { title, body } = splitText(value);
      this.item.title = title;
      this.item.content = body;
      this.upload();
    }
  }

  @Throttle(2500)
  upload() {
    if (this.id && this.item) {
      items.doc(this.id).update(this.item);
      this.synced = true;
    }
  }

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    items
      .doc(route.params.id)
      .get()
      .then(snapshot => {
        this.id = snapshot.id;
        this.item = snapshot.data() as Item;
        this.synced = true;
      });
  }
}
</script>
