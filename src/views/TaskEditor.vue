<template>
  <div>
    <textarea v-model="title"></textarea>
    <Task v-bind:id="id" />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Task from "@/components/Task.vue";
import VueMarkdown from "vue-markdown";

@Component({ components: { Task, VueMarkdown } })
export default class TaskEditor extends Vue {
  get id() {
    return this.$route.params.id;
  }
  get task() {
    return this.$store.state.tasks[this.id];
  }
  get title() {
    return this.task.title;
  }
  set title(value) {
    this.$store.commit("updateTitle", {
      id: this.id,
      title: value
    });
  }
}
</script>
