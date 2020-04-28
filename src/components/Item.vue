<template>
  <component
    v-if="item"
    v-bind:item="item"
    v-bind:is="type"
    v-bind:depth="depth"
    class="item"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Board from '@/components/Board.vue';
import ItemData from '@/models/ItemData';
import Note from '@/components/Note.vue';

@Component
export default class Item extends Vue {
  @Prop() private item!: ItemData;
  @Prop() private depth!: number;

  get id() {
    return this.$route.params.id;
  }

  get type() {
    switch (this.item.view) {
      case 'note':
        return Note;
      case 'board':
        return Board;
      default:
        throw `invalid item type ${this.item.type}`;
    }
  }
}
</script>
