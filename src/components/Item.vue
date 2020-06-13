<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import { Route } from 'vue-router';
import ItemCard from '@/components/ItemCard.vue';

@Component({ components: { ItemCard } })
export default class Item extends Vue {
  item = null;

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    this.$bind('item', items.doc(route.params.id));
  }
}
</script>

<template>
  <item-card v-if="item" v-bind:item="item" v-title="item.title" root />
</template>
