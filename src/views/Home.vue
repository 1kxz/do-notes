<template>
  <div class="home">Hello {{ user.name }}!</div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/db';

@Component({
  firestore: {
    user: db.collection('users').doc('Sys9gLK44wJRytsgYAbt')
  }
})
export default class Home extends Vue {
  user = { name: 'placeholder' };
}
</script>
