import Vue from 'vue'
import Vuex from 'vuex'
import _, { reject } from "lodash";
import moment from 'moment'
import axios from 'axios'


import router from '../router/index'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    babybox: {
        default: function() {
          return {
            name: '',
            customName: '',
            lastData: '',
            installDate: '',
            lastServisDate: '',
            active: true,
            address: {
                hospitalName: '',
                street: '',
                city: '',
                postcode: ''
            },
            network: {
                networkType: 0,
                ip: {
                    pc: '',
                    pcMask: '',
                    pcGateway: '',
                    routerLAN: '',
                    routerWAN: '',
                    routerGateway: '',
                    SDSMotory: '',
                    SDSTopeni: '',
                    camera: ''
                },
                notes: ''
            },
            components: {
                camera: '',
                OS: '',
                PC: ''
            },
            contacts: [{
                name: '',
                phoneNumber: '',
                email: '',
                notes: ''
            }],
            notes: ''
          };
        },
        active: {},
        loading: true,
    },
    data: {
        default: function() {
          return {
            idBabybox: "",
            status: -1,
            time: "-",
            temperature: {
              outside: "-",
              inner: "-",
              bottom: "-",
              top: "-",
              casing: "-"
            },
            voltage: {
              in: "-",
              battery: "-"
            }
          }
        },
        active: [],
        loading: true,
    },
    loggedIn: false,
    user: {},
    alerts: {}
  },
  mutations: {
    updateBabybox(state, babybox) {
      state.babybox.active = _.merge(state.babybox.default(), babybox);
      state.babybox.loading = false
    },
    updateData(state, data) {
      state.data.active = [];
      data.map(x => {
        x.time = moment(x.time).format("DD.MM.YYYY HH:mm")
        _.merge(state.data.default(), x)
      })
      state.data.active = data;
      state.data.loading = false
    },
    login(state) {
      state.loggedIn = true,
      state.user = JSON.parse(localStorage.getItem("auth")).user
      axios.defaults.headers.common["Authorization"] = JSON.parse(localStorage.getItem("auth")).token;
    },
    logout(state) {
      state.loggedIn = false,
      state.user = {}
      axios.defaults.headers.common["Authorization"] = JSON.parse(localStorage.getItem("auth")).token;
    }
  },
  actions: {
    async getBabybox(context, payload) {
      context.state.babybox.loading = true
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `babybox/name/${ payload.name }`
        })
        .then(response => response.data)
        .then(babybox => {
          context.commit("updateBabybox", babybox)
          resolve(babybox)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async getAllBabyboxes(context) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "babybox/all/populate"
        })
        .then(response => response.data)
        .then(babyboxes => {
          resolve(babyboxes)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err);
        });
      })
    },
    async putBabybox(context, babybox) {
      return new Promise((resolve, reject) => {
        axios({
          method: "PUT",
          url: `babybox/${ babybox._id }`,
          data: babybox
        })
        .then(response => response.data)
        .then(babybox => {
          context.commit("updateBabybox", babybox)
          resolve(babybox)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async getData(context, payload) {
      context.state.data.loading = true
      if(!payload.filter) {
        payload.filter = {
          from: moment().add(-7, 'days').format("YYYY-MM-DD"),
          to: moment().format("YYYY-MM-DD")
        }
      }
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `data/babybox/${ payload.id }`,
          data: payload.filter
        })
        .then(response => response.data)
        .then(data => {
          context.commit("updateData", data)
          resolve(data)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async createUser(context, user)  {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `/user/`,
          data: user
        })
        .then(response => response.data)
        .then(user => {
          resolve(user)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async getGlobalNotifications(context) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: "notification/template/global"
        })
        .then(response => response.data)
        .then(notifications => {
          resolve(notifications)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err);
        });
      })
    },
    async createGlobalNotification(context, notification) {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: `notification/template/global`,
          data: notification
        })
        .then(response => response.data)
        .then(notification => {
          resolve(notification)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async uploadImage(context, payload) {
      return new Promise((resolve, reject) => {
        axios
        .post(`babybox/${ payload.babybox._id }/gallery`, payload.data)
        .then(response => {
          resolve(response)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err)
        })
      })
    },
    async getImages(context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `babybox/${ payload.name }/gallery`
        })
        .then(response => response.data)
        .then(files => {
          resolve(files)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err);
        });
      })
    },
    async getNotifications(context, payload) {
      return new Promise((resolve, reject) => {
        axios({
          method: "GET",
          url: `notification/babybox/${ payload.id }`
        })
        .then(response => response.data)
        .then(notifications => {
          console.log(notifications)
          resolve(notifications)
        })
        .catch(err => {
          if(err.response.status == 401) {
            context.commit("logout")
            router.push("/login")
          }
          reject(err);
        });
      })
    }
  }
})
