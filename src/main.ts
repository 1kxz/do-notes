import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/tailwind.css';
import '@/assets/css/style.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    const savedState = localStorage.getItem('store');
    if (savedState) {
      store.commit('initialise', JSON.parse(savedState));
    }
  }
}).$mount('#app');

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state));
});
