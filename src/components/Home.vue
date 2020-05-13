<template>
  <div class="home text">
    <p>
      Notes is a mix between a note taking application and a task manager. You
      can:
    </p>
    <ul>
      <li>
        Write notes in markdown and link them to other notes, like you would in
        a wiki.
      </li>
      <li>
        Set deadlines, reminders and add checklists to your notes to organize
        your work.
      </li>
      <li>
        Have subtasks or nested notes, kind of like in org-mode.
      </li>
    </ul>
    <p>
      Notes is built around three constructs: Notes, Tags and Triggers. They're
      all quite simple but once you understand them you'll be able to adapt
      Notes to fit your workflow.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.text {
  @apply p-4 mx-auto;
  max-width: 50rem;
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>
