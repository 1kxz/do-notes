import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface Item {
  text: string;
  subitems: string[];
}

export interface ItemUpdate {
  id: string;
  subitems: string[];
}

function recursivelyDelete(items: { [key: string]: Item }, id: string) {
  for (const key of items[id].subitems) {
    recursivelyDelete(items, key);
  }
  for (const key in items) {
    const item = items[key];
    for (let i = 0; i < item.subitems.length; i++) {
      if (item.subitems[i] == id) {
        item.subitems.splice(i, 1);
        continue;
      }
    }
  }
  delete items[id];
}

export default new Vuex.Store({
  state: {
    shortcuts: ['work', 'groceries'],
    items: {
      groceries: {
        text: 'Shopping list',
        view: 'task',
        subitems: []
      },
      work: {
        text: 'To do',
        view: 'board',
        subitems: ['inbx', 'todo', 'done']
      },
      inbx: { text: 'Inbox', view: 'task', subitems: [] },
      todo: {
        text: 'To do',
        view: 'task',
        subitems: ['pers', 'typs', 'tggl', 'tags']
      },
      done: { text: 'Done', view: 'task', subitems: ['move', 'mpcl'] },
      pers: {
        text: 'Persistence\nSave modifications made to the items.',
        view: 'task',
        subitems: ['locl', 'srvr']
      },
      locl: { text: 'Save locally', view: 'task', subitems: [] },
      srvr: {
        text: 'Save to a server',
        view: 'task',
        subitems: []
      },
      typs: {
        text: 'Card views\n* Single card\n * Board\n * Timeline',
        view: 'task',
        subitems: ['ctbd']
      },
      ctbd: {
        text: 'Display cards based on their view, remember view',
        view: 'task',
        subitems: []
      },
      tggl: {
        text: 'Remember if cards ar expanded or contracted',
        view: 'task',
        subitems: []
      },
      tags: {
        text: 'Allow tagging items',
        view: 'task',
        subitems: ['tgst']
      },
      tgst: {
        text: 'Style based on tags',
        view: 'task',
        subitems: []
      },
      move: {
        text: 'Allow to move subitems between items',
        view: 'task',
        subitems: []
      },
      mpcl: { text: 'Multiple columns', view: 'task', subitems: [] }
    } as { [key: string]: Item }
  },
  mutations: {
    updateitems(state, payload: ItemUpdate) {
      state.items[payload.id].subitems = payload.subitems;
    },
    updateText(state, payload) {
      state.items[payload.id].text = payload.text;
    },
    delete(state, id) {
      recursivelyDelete(state.items, id);
    },
    create(state, parentId) {
      const parent = state.items[parentId];
      const id = `${parentId}-${parent.subitems.length + 1}`;
      Vue.set(state.items, id, { text: 'New task', subitems: [] });
      parent.subitems.push(id);
    }
  },
  actions: {},
  modules: {}
});
