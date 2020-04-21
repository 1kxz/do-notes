<template>
  <component v-bind:is="type" v-bind:id="id" expand="true" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Task from '@/components/Task.vue';
import Board from '@/components/Board.vue';

@Component({ components: { Task, Board } })
export default class ItemView extends Vue {
  get id() {
    return this.$route.params.id;
  }
  get item() {
    return this.$store.state.items[this.id];
  }
  get type() {
    switch (this.item.view) {
      case 'task':
        return Task;
      case 'board':
        return Board;
      default:
        throw `invalid item type ${this.item.type}`;
    }
  }
}
</script>
