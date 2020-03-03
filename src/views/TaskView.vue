<template>
  <Task v-bind:id="$route.params.id" />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Task from "@/components/Task.vue";

@Component({ components: { Task } })
export default class TaskView extends Vue {}
</script>
