<template>
  <component v-if="item" v-bind:item="item" v-bind:is="type" class="item" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Note from '@/components/Note.vue';
import ItemData from '@/models/ItemData';

@Component
export default class Item extends Vue {
  @Prop() private item!: ItemData;

  get id() {
    return this.$route.params.id;
  }

  get type() {
    switch (this.item.view) {
      case 'pad':
      case 'board':
        return Note;
      default:
        throw `invalid item type ${this.item.type}`;
    }
  }
}
</script>
