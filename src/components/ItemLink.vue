<template>
  <router-link v-bind:to="target">
    <fa-icon v-bind:icon="icon" /> {{ content.title }}
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { splitText } from '@/models/database';
import Item from '@/models/Item';

@Component({ components: { FaIcon } })
export default class ItemLink extends Vue {
  @Prop() private item!: Item;

  get target() {
    return { name: 'Viewer', params: { id: this.item.id } };
  }
  get content() {
    return splitText(this.item.text);
  }

  get icon() {
    switch (this.item.view) {
      case 'note':
        switch (this.item.orientation) {
          case 'horizontal':
            return 'columns';
          case 'vertical':
            return 'stream';
          default:
            throw `invalid item orientation ${this.item.orientation}`;
        }
      default:
        throw `invalid item view ${this.item.view}`;
    }
  }
}
</script>
