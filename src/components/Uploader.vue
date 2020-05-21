<template>
  <div v-if="item" class="image-uploader">
    <input id="file" type="file" />
    <button v-on:click="uploadImage">Upload</button>
    <item-viewer v-bind:item="item" v-bind:root="item.parent == null" />
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import { Route } from 'vue-router';
import { ThrottleSetter } from 'lodash-decorators';
import ItemViewer from '@/components/ItemViewer.vue';
import Item from '@/models/Item';

@Component({ components: { ItemViewer } })
export default class Uploader extends Vue {
  item: Item | null = null;

  get text() {
    return this.item?.text;
  }

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    this.$bind('item', items.doc(route.params.id));
  }

  uploadImage() {
    const file = document.getElementById('file');
    const item = this.item;
    if (item !== null && file !== null) {
      const files = (file as HTMLInputElement).files;
      if (files?.length) {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          items
            .doc(item.id)
            .update({ text: item.text + '\n' + reader.result, view: 'image' });
        };
      }
    }
  }
}
</script>
