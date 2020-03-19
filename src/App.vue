<template>
  <div id="app">
    <nav class="bg-white text-blue-800">
      <router-link class="p-2" to="/">◓●◑●</router-link>
      <draggable id="shortcuts" tag="span">
        <router-link class="p-2" v-for="id in shortcuts" v-bind:key="id" v-bind:to="id">{{ id }}</router-link>
      </draggable>
      <router-link class="p-2" to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";

@Component({ components: { Draggable } })
export default class App extends Vue {
  get shortcuts() {
    return this.$store.state.shortcuts;
  }
}
</script>
