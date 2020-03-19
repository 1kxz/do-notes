import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export interface Task {
  title: string;
  subtasks: string[];
}

export interface TaskUpdate {
  id: string;
  subtasks: string[];
}

function recursivelyDelete(tasks: { [key: string]: Task }, id: string) {
  console.log(`deleting ${id}`);
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
    shortcuts: ["/board/work", "/task/groceries"],
    tasks: {
      groceries: {
        title: "Shopping list",
        subtasks: [] as string[]
      },
      work: {
        title: "To do",
        subtasks: ["inbox", "todo", "done"]
      } as Task,
      inbox: { title: "Inbox", subtasks: [] as string[] } as Task,
      todo: { title: "To do", subtasks: ["persistence"] } as Task,
      done: { title: "Done", subtasks: ["move", "columns"] } as Task,
      persist: {
        title: "Persistence\nBlablabla this is a test!",
        subtasks: ["local", "server"]
      } as Task,
      local: { title: "Save locally", subtasks: [] as string[] } as Task,
      server: {
        title: "Save to a server",
        subtasks: [] as string[]
      } as Task,
      move: {
        title: "Allow to move subtasks between tasks",
        subtasks: [] as string[]
      } as Task,
      columns: { title: "Multiple columns", subtasks: [] as string[] } as Task
    } as { [key: string]: Task }
  },
  mutations: {
    updateTasks(state, payload: TaskUpdate) {
      state.tasks[payload.id].subtasks = payload.subtasks;
    },
    updateTitle(state, payload) {
      state.tasks[payload.id].title = payload.title;
    },
    delete(state, id) {
      recursivelyDelete(state.tasks, id);
    },
    create(state, parentId) {
      const parent = state.tasks[parentId];
      const id = `${parentId}-${parent.subtasks.length + 1}`;
      Vue.set(state.tasks, id, { title: "New task", subtasks: [] });
      parent.subtasks.push(id);
    }
  },
  actions: {},
  modules: {}
});
