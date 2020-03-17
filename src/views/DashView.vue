<template>
  <Dash v-bind:id="id" />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Dash from "@/components/Dash.vue";

@Component({ components: { Dash } })
export default class DashView extends Vue {
  get id() {
    return this.$route.params.id;
  }
}
</script>
