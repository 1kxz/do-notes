<template>
  <div class="agenda">
    <TaskList id="root" />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import TaskList from "@/components/TaskList.vue";

@Component({ components: { TaskList } })
export default class Agenda extends Vue {}
</script>
