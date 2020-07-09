import Vue from "vue";
import VueRouter from "vue-router";

//Views
import Home from "../views/Home.vue";
import Help from "../views/Help.vue";
import Babybox from "../views/Babybox.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/help",
    name: "Help",
    component: Help
  },
  {
    path: "/babybox/:name",
    name: "Babybox",
    component: Babybox
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
