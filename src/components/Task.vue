<template>
  <div class="task">
    <router-link v-bind:to="link">#</router-link>
    <vue-markdown>{{ task.title }}</vue-markdown>
    <draggable class="subtasks" v-if="task.subtasks" v-model="task.subtasks">
      <Task v-for="subtask in task.subtasks" v-bind:key="subtask" v-bind:id="subtask" />
    </draggable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";
import VueMarkdown from "vue-markdown";

@Component({ components: { Draggable, VueMarkdown } })
export default class Task extends Vue {
  @Prop() private id!: string;
  get task() {
    return this.$store.state.tasks[this.id];
  }
  get link() {
    return { name: "TaskView", params: { id: this.id } };
  }
}
</script>

<style lang="scss">
.task {
  padding: 0 10px;
  border: 1px solid #eee;
  margin: 2px 0;
  background: #fff;
  border-radius: 2px;
}
.task.sortable-chosen {
  border-color: #f00;
}
</style>
