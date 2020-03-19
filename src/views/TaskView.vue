<template>
  <div>
    <textarea v-model="text"></textarea>
    <task v-bind:id="id" expand="true" />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Task from '@/components/Task.vue';
import VueMarkdown from 'vue-markdown';

@Component({ components: { Task, VueMarkdown } })
export default class TaskView extends Vue {
  get id() {
    return this.$route.params.id;
  }
  get task() {
    return this.$store.state.tasks[this.id];
  }
  get text() {
    return this.task.text;
  }
  set text(value) {
    this.$store.commit('updateText', {
      id: this.id,
      text: value
    });
  }
}
</script>
