<template>
  <component
    v-if="item"
    v-bind:is="type"
    v-bind:item="item"
    v-bind:root="root"
    class="item"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Picture from '@/components/Picture.vue';
import Item from '@/models/Item';
import Note from '@/components/Note.vue';

@Component
export default class ItemViewer extends Vue {
  @Prop() private item!: Item;
  @Prop(Boolean) private root!: boolean;

  get type() {
    switch (this.item.view) {
      case 'board':
      case 'pad':
        return Note;
      case 'image':
        return Picture;
      default:
        throw `invalid item type ${this.item.view}`;
    }
  }
}
</script>
