import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home.vue';
import Editor from '../components/Editor.vue';
import Viewer from '../components/Viewer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/help',
    name: 'Help',
    // route level code-splitting
    // this generates a separate chunk (help.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../components/Help.vue')
  },
  {
    path: '/:id',
    name: 'Viewer',
    component: Viewer
  },
  {
    path: '/:id/edit',
    name: 'Editor',
    component: Editor
  }
];

const router = new VueRouter({
  routes
});

export default router;
