<template>
  <item v-if="item" v-bind:item="item" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import Item from '@/components/Item.vue';
import { Route } from 'vue-router';

@Component({ components: { Item } })
export default class Viewer extends Vue {
  item = null;

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    this.$bind('item', items.doc(route.params.id));
  }
}
</script>
