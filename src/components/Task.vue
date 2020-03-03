<template>
  <div class="task">
    <nav>
      <router-link v-bind:to="link">#{{ id }}</router-link>
      <router-link v-bind:to="edit">edit</router-link>
    </nav>
    <vue-markdown v-bind:source="task.title"></vue-markdown>
    <TaskList v-bind:id="id" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TaskList from "@/components/TaskList.vue";
import VueMarkdown from "vue-markdown";

@Component({ components: { TaskList, VueMarkdown } })
export default class Task extends Vue {
  @Prop() private id!: string;
  get task() {
    return this.$store.state.tasks[this.id];
  }
  get link() {
    return { name: "TaskView", params: { id: this.id } };
  }
  get edit() {
    return { name: "TaskEditor", params: { id: this.id } };
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
  position: relative;
}
.task nav {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 10px;
}
.task.sortable-chosen {
  border-color: #f00;
}
</style>
