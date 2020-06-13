<script>
import { authUi, authConfig } from '@/auth';
import { Component, Vue } from 'vue-property-decorator';

import 'firebaseui/dist/firebaseui.css';

@Component
export default class Login extends Vue {
  mounted() {
    authUi.start('#auth', authConfig);
  }
}
</script>

<template>
  <div id="auth" v-title="'Login'" />
</template>

<style lang="scss" scoped>
#auth {
  @apply m-6;
}
</style>
