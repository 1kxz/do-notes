<template>
  <board v-bind:id="id" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Board from '@/components/Board.vue';

@Component({ components: { Board } })
export default class BoardView extends Vue {
  get id() {
    return this.$route.params.id;
  }
}
</script>
