import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [
      { title: "First task" },
      { title: "Second task" },
      { title: "Third task" }
    ]
  },
  mutations: {},
  actions: {},
  modules: {}
});
