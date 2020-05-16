import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../components/Help.vue')
  },
  {
    path: '/import',
    name: 'Importer',
    component: () => import('../components/Importer.vue')
  },
  {
    path: '/item/:id',
    name: 'Viewer',
    component: () => import('../components/Viewer.vue')
  },
  {
    path: '/item/:id/edit',
    name: 'Editor',
    component: () => import('../components/Editor.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
