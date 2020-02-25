<template>
  <div class="checklist">
    <ol>
      <li v-for="task in tasks" v-bind:key="task.title">{{ task.title }}</li>
    </ol>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  get tasks(): string {
    return this.$store.state.tasks;
  }
}
</script>
