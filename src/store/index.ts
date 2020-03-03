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
      "": { subtasks: ["1", "2", "3"] } as Task,
      "1": { title: "First task" } as Task,
      "2": { title: "Second task", subtasks: ["4"] } as Task,
      "3": {
        title: "### Third *very* **important** task",
        subtasks: ["5", "6"]
      } as Task,
      "4": { title: "Fourth [task](https://en.wikipedia.org/)" } as Task,
      "5": { title: "#### Subtask number one" } as Task,
      "6": { title: "#### Subtask number **two**" } as Task
    } as { [key: string]: Task }
  },
  mutations: {
    updateTasks(state, payload: TaskUpdate) {
      state.tasks[payload.id].subtasks = payload.subtasks;
    }
  },
  actions: {},
  modules: {}
});
