<template>
  <component v-if="item" v-bind:is="type" v-bind:item="item" class="item" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ItemData from '@/models/ItemData';
import Note from '@/components/Note.vue';

@Component
export default class Item extends Vue {
  @Prop() private item!: ItemData;

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
