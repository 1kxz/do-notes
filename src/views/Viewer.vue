<template>
  <item v-if="item" v-bind:item="item" v-bind:depth="5" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { items } from '@/models/database';
import Item from '@/components/Item.vue';

@Component({ components: { Item } })
export default class Viewer extends Vue {
  item = null;

  get id() {
    return this.$route.params.id;
  }

  mounted() {
    this.$bind('item', items.doc(this.id));
  }
}
</script>
