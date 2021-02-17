<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { dateToString } from '@/utils';
import { firebaseAuth } from '@/auth';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome';
import { items } from '@/database';
import Item from '@/models/Item';
import ItemLink from '@/components/ItemLink.vue';

@Component({ components: { ItemLink, FaIcon } })
export default class ItemRecent extends Vue {
  subitems: Item[] = [];

  mounted() {
    firebaseAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.$bind(
          'subitems',
          items.where('uid', '==', auth.uid).orderBy('updated', 'desc')
        );
      }
    });
  }

  icon(item: Item) {
    switch (item.view) {
      case 'pad':
        return 'file-alt';
      case 'board':
        return 'columns';
      case 'wide':
        return 'th-large';
      case 'tab':
        return 'folder';
      default:
        throw `invalid item view ${item.view}`;
    }
  }

  size(item: Item) {
    return (
      item.title.length + (item.content !== null ? item.content.length : 0)
    );
  }

  dateToString(date: Date) {
    return dateToString(date);
  }

  editUrl(id: string) {
    return { name: 'ItemEdit', params: { id: id } };
  }
}
</script>

<template>
  <table>
    <tr v-for="item in subitems" v-bind:key="item.id">
      <td>
        <span v-if="item.parent === null"><fa-icon icon="bookmark"/></span>
      </td>
      <td><item-link v-bind:item="item" /></td>
      <td><fa-icon v-bind:icon="icon(item)" /></td>
      <td>{{ item.format }}</td>
      <td class="size">{{ size(item) }}</td>
      <td>{{ dateToString(item.updated) }}</td>
      <td>
        <router-link v-bind:to="editUrl(item.id)">
          <fa-icon icon="edit" />
        </router-link>
      </td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
table {
  @apply mx-auto my-2;
  td {
    @apply p-2;
  }
  tr:hover {
    @apply bg-keybg text-keyfg;
  }
  td.size {
    @apply text-right;
  }
}
</style>
