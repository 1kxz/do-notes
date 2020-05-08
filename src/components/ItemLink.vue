<template>
  <router-link v-bind:to="target">
    {{ content.title }} <fa-icon v-bind:icon="icon" />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { splitText } from '@/models/database';
import ItemData from '@/models/ItemData';

@Component({ components: { FaIcon } })
export default class Item extends Vue {
  @Prop() private item!: ItemData;

  get target() {
    return { name: 'Viewer', params: { id: this.item.id } };
  }
  get content() {
    return splitText(this.item.text);
  }

  get icon() {
    switch (this.item.view) {
      case 'pad':
        return 'stream';
      case 'board':
        return 'columns';
      default:
        throw `invalid item type ${this.item.view}`;
    }
  }
}
</script>
