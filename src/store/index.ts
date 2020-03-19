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
        subtasks: [] as string[]
      },
      work: {
        text: 'To do',
        subtasks: ['inbox', 'todo', 'done']
      } as Task,
      inbox: { text: 'Inbox', subtasks: [] as string[] } as Task,
      todo: { text: 'To do', subtasks: ['persist'] } as Task,
      done: { text: 'Done', subtasks: ['move', 'columns'] } as Task,
      persist: {
        text: 'Persistence\nBlablabla this is a test!',
        subtasks: ['local', 'server']
      } as Task,
      local: { text: 'Save locally', subtasks: [] as string[] } as Task,
      server: {
        text: 'Save to a server',
        subtasks: [] as string[]
      } as Task,
      move: {
        text: 'Allow to move subtasks between tasks',
        subtasks: [] as string[]
      } as Task,
      columns: { text: 'Multiple columns', subtasks: [] as string[] } as Task
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
