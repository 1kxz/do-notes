<template>
  <draggable class="task-list" v-if="tasks" v-model="tasks">
    <Task v-for="task in tasks" v-bind:key="task" v-bind:id="task" />
  </draggable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";

// Lazy import due to circular dependency
const Task = () => import("@/components/Task.vue");

@Component({ components: { Draggable, Task } })
export default class TaskList extends Vue {
  @Prop() private id!: string;
  get tasks() {
    return this.$store.state.tasks[this.id].subtasks;
  }
  set tasks(value) {
    this.$store.commit("updateTasks", { id: this.id, subtasks: value });
  }
}
</script>
