<template>
  <draggable class="board flex mb-4">
    <div class="column flex-1" v-for="(task, id) in subtasks" v-bind:key="task.title">
      <h2 class="px-4 py-2 text-gray-500">{{ task.title }}</h2>
      <TaskList class="-my-2" v-bind:id="id" expand="true" />
    </div>
  </draggable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TaskList from "@/components/TaskList.vue";
import Draggable from "vuedraggable";

interface Task {
  title: string;
  subtasks: string[];
}

@Component({ components: { Draggable, TaskList } })
export default class Board extends Vue {
  @Prop() private id!: string;
  get task() {
    return this.$store.state.tasks[this.$props.id];
  }
  get subtasks() {
    const tasks = {} as { [key: string]: Task };
    for (const taskId of this.task.subtasks) {
      tasks[taskId] = this.$store.state.tasks[taskId];
    }
    return tasks;
  }
}
</script>
