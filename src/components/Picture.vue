<template>
  <img v-bind:src="source" v-bind:title="title" />
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Picture extends Vue {
  @Prop() private source!: string;
  @Prop() private title!: string;
}
</script>
