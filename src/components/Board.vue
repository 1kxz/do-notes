<template>
  <draggable class="board flex mb-4">
    <div
      v-for="(item, id) in subitems"
      v-bind:key="item.text"
      class="column flex-1"
    >
      <h2 class="px-4 py-2 text-gray-500">{{ item.text }}</h2>
      <task-list v-bind:id="id" expand="true" class="-my-2" />
    </div>
  </draggable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TaskList from '@/components/TaskList.vue';
import Draggable from 'vuedraggable';

interface Item {
  text: string;
  subitems: string[];
}

@Component({ components: { Draggable, TaskList } })
export default class Board extends Vue {
  @Prop() private id!: string;
  get item() {
    return this.$store.state.items[this.$props.id];
  }
  get subitems() {
    const items = {} as { [key: string]: Item };
    for (const itemId of this.item.subitems) {
      items[itemId] = this.$store.state.items[itemId];
    }
    return items;
  }
}
</script>
