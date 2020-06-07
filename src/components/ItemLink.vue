<template>
  <router-link v-bind:to="target" class="item-link">
    <fa-icon v-bind:icon="icon" /> {{ item.title }}
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import Item from '@/models/Item';

@Component({ components: { FaIcon } })
export default class ItemLink extends Vue {
  @Prop() private item!: Item;

  get target() {
    return { name: 'Viewer', params: { id: this.item.id } };
  }

  get icon() {
    switch (this.item.view) {
      case 'pad':
        return 'file-alt';
      case 'board':
        return 'columns';
      case 'wide':
        return 'book-open';
      default:
        throw `invalid item view ${this.item.view}`;
    }
  }
}
</script>
