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
    name: 'Import',
    component: () => import('../components/Import.vue')
  },
  {
    path: '/item/:id',
    name: 'Item',
    component: () => import('../components/Item.vue')
  },
  {
    path: '/item/:id/edit',
    name: 'ItemEdit',
    component: () => import('../components/ItemEdit.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
