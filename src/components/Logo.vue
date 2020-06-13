<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Logo extends Vue {
  @Prop() private theme!: { [key: string]: string };
}
</script>

<template>
  <svg width="90" height="90" viewBox="0 0 100 100">
    <defs>
      <clipPath id="cut-off">
        <rect x="0" y="0" width="90" height="90" rx="30" />
      </clipPath>
    </defs>
    <g clip-path="url(#cut-off)">
      <g transform="rotate(12 45 45)">
        <rect
          x="-30"
          y="-30"
          width="61"
          height="76"
          v-bind:fill="theme.highlightbg"
        />
        <rect x="30" y="-30" width="90" height="76" v-bind:fill="theme.keybg" />
        <rect x="-30" y="45" width="91" height="75" v-bind:fill="theme.rimbg" />
        <rect
          x="60"
          y="45"
          width="60"
          height="75"
          v-bind:fill="theme.backlightbg"
        />
      </g>
    </g>
  </svg>
</template>
