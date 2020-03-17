<template>
  <div>
    <draggable class="board flex mb-4">
      <div class="column flex-1" v-for="task in subtasks" v-bind:key="task.title">
        <span class="px-4 py-2 text-red-500">{{ task.title }}</span>
      </div>
    </draggable>
    <Board v-bind:id="first" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TaskList from "@/components/TaskList.vue";
import Draggable from "vuedraggable";
import Board from "@/components/Board.vue";

interface Task {
  title: string;
  subtasks: string[];
}

@Component({ components: { Draggable, Board } })
export default class Dash extends Vue {
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
  get first() {
    return this.task.subtasks[0];
  }
}
</script>
