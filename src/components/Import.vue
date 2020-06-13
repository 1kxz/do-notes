<template>
  <div class="importer" v-title="'Import'">
    <div class="editor">
      <textarea v-model="text"></textarea>
      <button v-on:click="importClick">Import</button>
    </div>
    <div class="preview">
      <item-card
        v-for="item in items"
        v-bind:key="item.id"
        v-bind:item="item"
      ></item-card>
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
      @apply p-2 text-keyfg;
      min-height: 25rem;
    }
    > button {
      @apply bg-rimbg rounded m-2 p-2;
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
import ItemCard from '@/components/ItemCard.vue';
import Item from '@/models/Item';

@Component({ components: { ItemCard } })
export default class Import extends Vue {
  items: Item[] = [];
  uid?: string;

  mounted() {
    firebaseAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.uid = auth.uid;
      }
    });
  }

  get text() {
    return JSON.stringify(this.items);
  }

  set text(value) {
    this.items = JSON.parse(value);
  }

  async importClick() {
    if (this.uid) {
      let remaining = [...this.items];
      const processed: { [key: string]: string } = {};
      while (remaining.length > 0) {
        const skipped: Item[] = [];
        for (const item of remaining) {
          const newParent =
            item.parent === null ? null : processed[item.parent];
          if (newParent !== undefined) {
            const { id, ...data } = { ...item };
            delete data.parent;
            const newItem = await items.add({
              uid: this.uid,
              parent: newParent,
              ...data
            });
            processed[id] = newItem.id;
          } else {
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
