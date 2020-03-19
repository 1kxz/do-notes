import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import BoardView from '../views/BoardView.vue';
import TaskView from '../views/TaskView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board/:id',
    name: 'BoardView',
    component: BoardView
  },
  {
    path: '/task/:id',
    name: 'TaskView',
    component: TaskView
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
