import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [
      { title: "First task" },
      { title: "Second task" },
      { title: "Third *very* **important** task" },
      { title: "Fourth [task](https://en.wikipedia.org/)" }
    ]
  },
  mutations: {
    updateTasks(state, value) {
      state.tasks = value;
    }
  },
  actions: {},
  modules: {}
});
