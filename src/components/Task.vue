<template>
  <div v-if="task" class="task m-2 p-2 bg-white border border-gray-300 rounded">
    <header class="flex items-center">
      <div v-if="expand" class="px-1 w-6 text-center">
        <font-awesome-icon icon="chevron-down" v-on:click="toggle" />
      </div>
      <div v-else class="px-1 w-6 text-center">
        <font-awesome-icon icon="chevron-right" v-on:click="toggle" />
      </div>
      <vue-markdown
        v-bind:source="content.title"
        class="flex-grow"
      ></vue-markdown>
    </header>
    <div v-if="expand">
      <hr />
      <vue-markdown
        v-if="content.body"
        v-bind:source="content.body"
        class="task-body m-2"
      ></vue-markdown>
      <task-list v-bind:id="id" />
      <hr />
      <nav class="flex items-center text-blue-600 px-1">
        <router-link v-bind:to="edit" class="flex-1 text-center">
          <font-awesome-icon icon="edit" />
        </router-link>
        <div class="flex-1 text-center">
          <font-awesome-icon icon="plus" v-on:click="create" />
        </div>
        <div class="flex-1 text-center">
          <font-awesome-icon icon="trash" v-on:click="trash" />
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TaskList from '@/components/TaskList.vue';
import VueMarkdown from 'vue-markdown';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faChevronRight,
  faEdit,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faChevronDown, faChevronRight, faEdit, faPlus, faTrash);

@Component({ components: { TaskList, VueMarkdown, FontAwesomeIcon } })
export default class Task extends Vue {
  @Prop() private id!: string;
  @Prop() private expand!: boolean;
  get task() {
    return this.$store.state.tasks[this.id];
  }
  get content() {
    let title = '';
    let body = this.task.text;
    while (!title.length && body.length) {
      [title] = body.split('\n', 1);
      body = body.slice(title.length + 1);
    }
    return { title, body };
  }
  get board() {
    return { name: 'Board', params: { id: this.id } };
  }
  get edit() {
    return { name: 'TaskView', params: { id: this.id } };
  }
  toggle() {
    this.$props.expand = !this.$props.expand;
  }
  trash() {
    this.$store.commit('delete', this.id);
  }
  create() {
    this.$store.commit('create', this.id);
  }
}
</script>

<style lang="scss" scoped>
.task {
  border-left-width: 3px;
  max-width: 42rem;
}
</style>
