<template>
  <draggable v-model="items" group="items" class="task-list">
    <task
      v-for="item in items"
      v-bind:key="item"
      v-bind:id="item"
      v-bind:expand="expand"
    />
  </draggable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

// Lazy import due to circular dependency
const Task = () => import('@/components/Task.vue');

@Component({ components: { Draggable, Task } })
export default class TaskList extends Vue {
  @Prop() private id!: string;
  @Prop() private expand!: boolean;
  get items() {
    const item = this.$store.state.items[this.id];
    return item.subitems;
  }
  set items(value) {
    this.$store.commit('updateitems', { id: this.id, subitems: value });
  }
}
</script>

<style scoped>
.task-list .sortable-chosen {
  @apply border-blue-500;
}
.task-list {
  min-height: 1.5rem;
}
</style>
