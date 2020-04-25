<template>
  <component v-if="item" v-bind:item="item" v-bind:is="type" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/db';
import Board from '@/components/Board.vue';
import Note from '@/components/Note.vue';

const items = db.collection('items');

@Component
export default class ItemView extends Vue {
  item = null;

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

  mounted() {
    this.$bind('item', items.doc(this.id));
  }
}
</script>
