<template>
  <div class="home">Hello {{ user.name }}!</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { users } from '@/models/db';

@Component({
  firestore: {
    user: users.doc('Sys9gLK44wJRytsgYAbt')
  }
})
export default class Home extends Vue {
  user = { name: 'placeholder' };
}
</script>
