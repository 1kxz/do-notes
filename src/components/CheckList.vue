<template>
  <div class="checklist">
    <draggable v-model="tasks">
      <vue-markdown v-for="task in tasks" v-bind:key="task.title">
        {{ task.title }}
      </vue-markdown>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";
import VueMarkdown from "vue-markdown";

@Component({ components: { Draggable, VueMarkdown } })
export default class HelloWorld extends Vue {
  get tasks(): string {
    return this.$store.state.tasks;
  }
  set tasks(value) {
    this.$store.commit("updateTasks", value);
  }
}
</script>
