import Vue from 'vue';
import App from './components/App.vue';
import router from './router';

import '@/assets/icons';
import '@/assets/css/tailwind.css';
import '@/assets/css/style.scss';
import '@/assets/css/themes.scss';

Vue.config.productionTip = false;

Vue.directive('title', {
  inserted: (el, binding) => (document.title = binding.value),
  update: (el, binding) => (document.title = binding.value)
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
