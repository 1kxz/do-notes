<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import Item from '@/models/Item';

@Component({ components: { FaIcon } })
export default class ItemLink extends Vue {
  @Prop() private item!: Item;

  get target() {
    return { name: 'Item', params: { id: this.item.id } };
  }
}
</script>

<template>
  <router-link v-bind:to="target" class="item-link">
    {{ item.title }}
  </router-link>
</template>
