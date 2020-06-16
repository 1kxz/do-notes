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
      <td>
        <router-link v-bind:to="editUrl(item.id)">
          <fa-icon icon="edit" />
        </router-link>
      </td>
      <td>{{ item.format }}</td>
      <td>{{ item.content.length }}</td>
      <td>{{ dateToString(item.updated) }}</td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
table {
  @apply mx-auto my-2;
  td {
    @apply p-2;
  }
}
</style>
