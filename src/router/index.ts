import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Agenda from "../views/Agenda.vue";
import TaskView from "../views/TaskView.vue";
import TaskEditor from "../views/TaskEditor.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/agenda",
    name: "Agenda",
    component: Agenda
  },
  {
    path: "/task/:id",
    name: "TaskView",
    component: TaskView
  },
  {
    path: "/task/:id/editor",
    name: "TaskEditor",
    component: TaskEditor
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
