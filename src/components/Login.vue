<template>
  <div id="auth" />
</template>

<style lang="scss" scoped>
#auth {
  @apply m-6;
}
</style>

<script>
import { authUi, authConfig } from '@/models/auth';
import { Component, Vue } from 'vue-property-decorator';

import 'firebaseui/dist/firebaseui.css';

@Component
export default class Login extends Vue {
  mounted() {
    authUi.start('#auth', authConfig);
  }
}
</script>
