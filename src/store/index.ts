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

export default new Vuex.Store({
  state: {
    tasks: {
      root: {
        title: "Hello world!",
        subtasks: ["todoboard"]
      } as Task,
      todoboard: {
        title: "To do",
        subtasks: ["inbox", "todo", "done"]
      } as Task,
      inbox: { title: "Inbox", subtasks: [] as string[] } as Task,
      todo: { title: "To do", subtasks: ["1"] } as Task,
      done: { title: "Done", subtasks: ["4", "5"] } as Task,
      "1": {
        title: "Persistence\nBlablabla this is a test!",
        subtasks: ["2", "3"]
      } as Task,
      "2": { title: "Save locally", subtasks: [] as string[] } as Task,
      "3": {
        title: "Save to a server",
        subtasks: [] as string[]
      } as Task,
      "4": {
        title: "Allow to move subtasks between tasks",
        subtasks: [] as string[]
      } as Task,
      "5": { title: "Multiple columns", subtasks: [] as string[] } as Task
    } as { [key: string]: Task }
  },
  mutations: {
    updateTasks(state, payload: TaskUpdate) {
      state.tasks[payload.id].subtasks = payload.subtasks;
    },
    updateTitle(state, payload) {
      state.tasks[payload.id].title = payload.title;
    }
  },
  actions: {},
  modules: {}
});
