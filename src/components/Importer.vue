<template>
  <div v-if="item" class="editor">
    <textarea v-model="text"></textarea>
    <div class="preview">
      <item v-bind:item="item" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.editor {
  @apply flex;
  > * {
    @apply flex-1;
  }
  > textarea {
    @apply p-2 text-contrast;
    min-height: 25rem;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Importer extends Vue {
  item = null;
}
</script>
