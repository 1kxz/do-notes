import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface Task {
  text: string;
  subtasks: string[];
}

export interface TaskUpdate {
  id: string;
  subtasks: string[];
}

function recursivelyDelete(tasks: { [key: string]: Task }, id: string) {
  for (const key of tasks[id].subtasks) {
    recursivelyDelete(tasks, key);
  }
  for (const key in tasks) {
    const task = tasks[key];
    for (let i = 0; i < task.subtasks.length; i++) {
      if (task.subtasks[i] == id) {
        task.subtasks.splice(i, 1);
        continue;
      }
    }
  }
  delete tasks[id];
}

export default new Vuex.Store({
  state: {
    shortcuts: ['/board/work', '/task/groceries'],
    tasks: {
      groceries: {
        text: 'Shopping list',
        subtasks: []
      },
      work: {
        text: 'To do',
        subtasks: ['inbx', 'todo', 'done']
      },
      inbx: { text: 'Inbox', subtasks: [] },
      todo: {
        text: 'To do',
        subtasks: ['pers', 'typs', 'tggl', 'tags']
      },
      done: { text: 'Done', subtasks: ['move', 'mpcl'] },
      pers: {
        text: 'Persistence\nSave modifications made to the tasks.',
        subtasks: ['locl', 'srvr']
      },
      locl: { text: 'Save locally', subtasks: [] },
      srvr: {
        text: 'Save to a server',
        subtasks: []
      },
      typs: {
        text: 'Card types\n* Single card\n * Board\n * Timeline',
        subtasks: ['ctbd']
      },
      ctbd: {
        text: 'Display cards based on their type, remember type',
        subtasks: []
      },
      tggl: {
        text: 'Remember if cards ar expanded or contracted',
        subtasks: []
      },
      tags: {
        text: 'Allow tagging tasks',
        subtasks: ['tgst']
      },
      tgst: {
        text: 'Style based on tags',
        subtasks: []
      },
      move: {
        text: 'Allow to move subtasks between tasks',
        subtasks: []
      },
      mpcl: { text: 'Multiple columns', subtasks: [] }
    } as { [key: string]: Task }
  },
  mutations: {
    updateTasks(state, payload: TaskUpdate) {
      state.tasks[payload.id].subtasks = payload.subtasks;
    },
    updateText(state, payload) {
      state.tasks[payload.id].text = payload.text;
    },
    delete(state, id) {
      recursivelyDelete(state.tasks, id);
    },
    create(state, parentId) {
      const parent = state.tasks[parentId];
      const id = `${parentId}-${parent.subtasks.length + 1}`;
      Vue.set(state.tasks, id, { text: 'New task', subtasks: [] });
      parent.subtasks.push(id);
    }
  },
  actions: {},
  modules: {}
});
