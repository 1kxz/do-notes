<template>
  <draggable v-model="tasks" group="tasks" class="task-list">
    <task
      v-for="task in tasks"
      v-bind:key="task"
      v-bind:id="task"
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
  get tasks() {
    const task = this.$store.state.tasks[this.id];
    return task.subtasks;
  }
  set tasks(value) {
    this.$store.commit('updateTasks', { id: this.id, subtasks: value });
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
