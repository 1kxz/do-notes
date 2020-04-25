<template>
  <div v-if="item" class="editor">
    <textarea v-model="text"></textarea>
    <item-view v-bind:item="item" />
  </div>
</template>

<style lang="scss" scoped>
div.editor {
  @apply flex;
  > * {
    @apply flex-1;
  }
  textarea {
    @apply p-2;
  }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/db';
import ItemView from '@/views/ItemView.vue';
import VueMarkdown from 'vue-markdown';
import { ThrottleSetter } from 'lodash-decorators';

const items = db.collection('items');

@Component({ components: { ItemView, VueMarkdown } })
export default class TaskView extends Vue {
  item = null;

  get id() {
    return this.$route.params.id;
  }

  get text() {
    return this.item.text;
  }

  @ThrottleSetter(1000)
  set text(value) {
    items
      .doc(this.id)
      .update({ text: value })
      .then(() => console.log('updated!'));
  }

  //   onTextInput = _.throttle(e => {
  //     // console.log('input', e.target.value);
  //   }, 1000);

  mounted() {
    this.$bind('item', items.doc(this.id));
  }
}
</script>
