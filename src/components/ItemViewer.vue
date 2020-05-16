<template>
  <component v-if="item" v-bind:is="type" v-bind:item="item" class="item" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Item from '@/models/Item';
import Note from '@/components/Note.vue';

@Component
export default class ItemViewer extends Vue {
  @Prop() private item!: Item;

  get type() {
    switch (this.item.view) {
      case 'note':
        return Note;
      default:
        throw `invalid item type ${this.item.view}`;
    }
  }
}
</script>
