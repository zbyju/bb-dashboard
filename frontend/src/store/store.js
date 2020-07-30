import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash";

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
        active: {

        },
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
    alerts: {

    }
  },
  mutations: {
    updateBabybox(state, babybox) {
      state.babybox.active = _.merge(state.babybox.default(), babybox);
      state.babybox.loading = false
    },
    updateData(state, data) {
      state.data.active = [];
      data.map(x => {
        _.merge(state.data.default(), x)
      })
      state.data.active = data;
      state.data.loading = false
    },
  },
  actions: {
    async getBabybox(context, payload) {
      context.state.babybox.loading = true
      return fetch(`http://localhost:3000/api/babybox/name/${ payload.name }`)
        .then(response => response.json())
        .then(babybox => {
          context.commit("updateBabybox", babybox)
        })
        .catch(err => {
          console.log(err);
        })
    },
    async getData(context, payload) {
      context.state.data.loading = true
      console.log(payload.id)
      if(!payload.filter) {
        payload.filter = {
          from: moment().add(-7, 'days').format("YYYY-MM-DD"),
          to: moment().format("YYYY-MM-DD")
        }
      }
      fetch(`http://localhost:3000/api/data/babybox/${ payload.id }`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload.filter)
      })
      .then(response => response.json())
      .then(data => {
        context.commit("updateData", data)
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
})
