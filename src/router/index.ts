import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Editor from '../views/Editor.vue';
import ItemView from '../views/ItemView.vue';

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
    component: () => import('../views/Help.vue')
  },
  {
    path: '/:id',
    name: 'ItemView',
    component: ItemView
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
