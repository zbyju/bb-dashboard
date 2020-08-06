import Vue from "vue";
import VueRouter from "vue-router";
import { store } from '../store/store'

//Views
import Home from "../views/Home.vue";
import Help from "../views/Help.vue";
import Babybox from "../views/Babybox.vue";
import EditBabybox from "../views/EditBabybox.vue";
import Contacts from "../views/Contacts.vue";
import Gallery from "../views/Gallery.vue";
import UploadImage from "../views/UploadImage.vue";
import Data from "../views/Data.vue";
import CheckConnection from "../views/CheckConnection.vue";
import NotificationsGlobal from "../views/NotificationsGlobal.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import Register from "../views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout
  },
  {
    path: "/register",
    name: "Register",
    component: Register
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
    path: "/babybox/gallery/:name",
    name: "Gallery",
    component: Gallery
  },
  {
    path: "/babybox/gallery/upload/:name",
    name: "UploadImage",
    component: UploadImage
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

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = !!JSON.parse(localStorage.getItem("auth"));

  if(loggedIn != store.state.loggedIn) {
    store.state.loggedIn = loggedIn
    if(loggedIn) {
      store.commit("login")
    } else {
      store.commit("logout")
    }
  }
  
  if(authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router;
