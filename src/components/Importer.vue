<template>
  <div class="importer">
    <div class="editor">
      <textarea v-model="text"></textarea>
      <button v-on:click="importClick">Import</button>
    </div>
    <div class="preview">
      <item-viewer
        v-for="item in items"
        v-bind:key="item.id"
        v-bind:item="item"
      ></item-viewer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.importer {
  @apply flex;
  > * {
    @apply flex-1;
  }
  > div.editor {
    @apply flex flex-col;
    > textarea {
      @apply p-2 text-contrast;
      min-height: 25rem;
    }
    > button {
      @apply bg-color rounded m-2 p-2;
    }
  }
  > div.preview {
    div.item {
      @apply rounded m-2;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { firebaseAuth } from '@/models/auth';
import { items } from '@/models/database';
import ItemViewer from '@/components/ItemViewer.vue';
import Item from '@/models/Item';

@Component({ components: { ItemViewer } })
export default class Importer extends Vue {
  items: Item[] = [];
  uid?: string;

  get text() {
    return JSON.stringify(this.items);
  }

  set text(value) {
    this.items = JSON.parse(value);
  }

  mounted() {
    firebaseAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.uid = auth.uid;
      }
    });
  }

  async importClick() {
    if (this.uid) {
      let remaining = [...this.items];
      const processed: { [key: string]: string } = {};
      while (remaining.length > 0) {
        // console.log(`importing ${remaining.length} items`);
        const skipped: Item[] = [];
        for (const item of remaining) {
          const newParent =
            item.parent === null ? null : processed[item.parent];
          if (newParent !== undefined) {
            // console.log(`uploading ${item.id}`);
            const { id, ...data } = { ...item };
            delete data.parent;
            const newItem = await items.add({
              uid: this.uid,
              parent: newParent,
              ...data
            });
            // console.log(`item ${id} maps to ${newItem.id}`);
            processed[id] = newItem.id;
          } else {
            // console.log(`undefined reference ${item.id}/${item.parent}`);
            skipped.push(item);
          }
        }
        if (skipped.length == remaining.length) {
          throw 'error resolving imported nodes';
        } else {
          remaining = skipped;
        }
      }
      this.items = [];
    }
  }
}
</script>
