import Vue from "vue";
import App from "./App.vue";
import { store } from './store/store'
import router from "./router";

import vuetify from "./plugins/vuetify";

import VueLodash from "vue-lodash";
import lodash from "lodash";
import axios from "axios"

import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(VueLodash, { name: 'custom' , lodash: lodash });
Vue.config.productionTip = false;

import moment from 'moment'
moment.locale('cs')
Vue.use(require('vue-moment'), { moment });
Vue.prototype.moment = moment

axios.defaults.baseURL = "http://localhost:3000/api/"


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
