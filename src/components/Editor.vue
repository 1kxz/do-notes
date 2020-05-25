<template>
  <div v-if="item" class="wrapper">
    <div class="editor">
      <nav>
        <button v-on:click="undo"><fa-icon icon="undo" /> Undo</button>
      </nav>
      <textarea v-model="text"></textarea>
    </div>
    <div class="viewer">
      <item-viewer
        v-bind:item="item"
        v-bind:root="item.parent == null"
        v-bind:class="[synced ? 'synced' : 'outdated']"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.wrapper {
  @apply flex flex-1;
  > * {
    @apply flex-1;
  }
}
div.editor {
  @apply flex flex-col bg-soft;
  button {
    @apply px-4 py-2 text-contrast border-r-2 border-soft;
    &:hover {
      @apply bg-hard;
    }
  }
  textarea {
    @apply flex-1 p-2 text-contrast;
    background-color: var(--highlight);
  }
}
div.viewer {
  @apply flex flex-col;
  div.item {
    @apply flex-1;
  }
  div.item.outdated {
    @apply opacity-75;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { items, splitText } from '@/models/database';
import { Route } from 'vue-router';
import { Throttle } from 'lodash-decorators';
import Item from '@/models/Item';
import ItemViewer from '@/components/ItemViewer.vue';

@Component({ components: { ItemViewer, FaIcon } })
export default class Editor extends Vue {
  id: string | null = null;
  item: Item | null = null;
  backup: Item | null = null;
  synced = false;

  get text() {
    if (this.item) {
      return this.item.title + '\n' + this.item.content;
    }
    return '';
  }

  set text(value: string) {
    if (this.item) {
      this.synced = false;
      const { title, body } = splitText(value);
      this.item.title = title;
      this.item.content = body;
      this.upload();
    }
  }

  undo() {
    this.item = { ...this.backup } as Item;
  }

  @Throttle(2500)
  upload() {
    if (this.id && this.item) {
      items.doc(this.id).update(this.item);
      this.synced = true;
    }
  }

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    items
      .doc(route.params.id)
      .get()
      .then(snapshot => {
        this.id = snapshot.id;
        this.item = snapshot.data() as Item;
        this.backup = { ...this.item } as Item;
        this.synced = true;
      });
  }
}
</script>
