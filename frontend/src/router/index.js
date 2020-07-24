import Vue from "vue";
import VueRouter from "vue-router";

//Views
import Home from "../views/Home.vue";
import Help from "../views/Help.vue";
import Babybox from "../views/Babybox.vue";
import EditBabybox from "../views/EditBabybox.vue";
import Contacts from "../views/Contacts.vue";
import Data from "../views/Data.vue";
import CheckConnection from "../views/CheckConnection.vue";
import NotificationsGlobal from "../views/NotificationsGlobal.vue";

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
  },
  {
    path: "/babybox/edit/:name",
    name: "EditBabybox",
    component: EditBabybox
  },
  {
    path: "/babybox/contacts/:name",
    name: "Contacts",
    component: Contacts
  },
  {
    path: "/babybox/data/:name",
    name: "Data",
    component: Data
  },
  {
    path: "/checkConnection",
    name: "CheckConnection",
    component: CheckConnection
  },{
    path: "/settings/notifications",
    name: "NotificationsGlobal",
    component: NotificationsGlobal
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
