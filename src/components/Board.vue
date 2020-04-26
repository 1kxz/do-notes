<style lang="scss">
div.board {
  > ul.subitems {
    @apply flex-row;
  }
}
</style>

<script lang="ts">
import Note from '@/components/Note.vue';

export default class Board extends Note {}
</script>
