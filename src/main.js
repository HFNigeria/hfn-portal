import { createApp } from 'vue'
import App from './App.vue'
import './style.css';
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRight,
  faCheck,
  faCircleInfo,
  faHeart,
  faStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App)

library.add(
  faArrowRight,
  faCheck,
  faCircleInfo,
  faHeart,
  faStar,
  faStarHalfStroke,
  faRegularStar
);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)
app.use(Toast);

app.mount('#app')