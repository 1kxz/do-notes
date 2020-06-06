<template>
  <item-viewer v-if="item" v-bind:item="item" v-title="item.title" root />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { items } from '@/models/database';
import ItemViewer from '@/components/ItemViewer.vue';
import { Route } from 'vue-router';

@Component({ components: { ItemViewer } })
export default class Viewer extends Vue {
  item = null;

  @Watch('$route', { immediate: true })
  onRouteChanged(route: Route) {
    this.$bind('item', items.doc(route.params.id));
  }
}
</script>
