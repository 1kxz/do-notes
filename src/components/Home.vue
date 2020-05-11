<template>
  <div class="home">
    <p>
      Notes is a mix between a note taking application and a task manager. You
      can:
    </p>
    <p>
      - Write notes in markdown and link them to other notes, like you would in
      a wiki.
    </p>
    <p>
      - Set deadlines, reminders and add checklists to your notes to organize
      your work.
    </p>
    <p>
      - Have subtasks or nested notes, kind of like in org-mode.
    </p>
    <p>
      Notes is built around three constructs: Notes, Tags and Triggers. They're
      all quite simple but once you understand them you'll be able to adapt
      Notes to fit your workflow.
    </p>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>
