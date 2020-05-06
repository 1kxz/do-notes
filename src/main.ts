import Vue from 'vue';
import App from './components/App.vue';
import router from './router';

import '@/assets/icons';
import '@/assets/css/tailwind.css';
import '@/assets/css/style.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
