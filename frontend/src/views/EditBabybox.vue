<template>
  <div class="help">

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      <span>{{ snackbar.text }}</span>
      <v-btn
        :color="snackbar.colorBtn"
        text
        @click="snackbar.show = false"
      >
        Zavřít
      </v-btn>
    </v-snackbar>

    <v-form class="mb-10">
      <v-container class="main mt-10">
        <h1 class="ma-3">Možnosti</h1>
        <h2 class="mx-3">Základní informace</h2>
        <v-row>
          <v-col class="flex-grow-1">
            <v-text-field label="Název" v-model="babybox.customName"></v-text-field>
          </v-col>
          <v-btn
            class="flex-grow-0 mt-5"
            @click="babybox.address.city = babybox.customName">
            Doplnit název do města
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Nemocnice" v-model="babybox.address.hospitalName"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Ulice" v-model="babybox.address.street"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field label="Město" v-model="babybox.address.city"></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="1">
            <v-text-field label="PSČ" v-model="babybox.address.postcode"></v-text-field>
          </v-col>
        </v-row>
        <h2 class="mx-3">Datumy</h2>
        <v-row>
          <v-col>
            <v-menu
              v-model="installDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="babybox.installDate"
                  label="Datum instalace"
                  prepend-icon="event"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="babybox.installDate"
                @input="installDateMenu = false;"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              v-model="lastServisDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="babybox.lastServisDate"
                  label="Datum posledního servisu"
                  prepend-icon="mdi-wrench"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="babybox.lastServisDate"
                @input="lastServisDateMenu = false;"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <h2 class="mx-3">Informace o síti</h2>
        <v-row>
          <v-col cols="12" class="py-0">
            <v-radio-group v-model="babybox.network.networkType" row>
              <v-radio
                :value="0"
                label="Nevyplněno"
              ></v-radio>
              <v-radio
                :value="1"
                label="VLAN"
              ></v-radio>
              <v-radio
                :value="2"
                label="Směrování"
              ></v-radio>
              <v-radio
                :value="3"
                label="V síti nemocnice"
              ></v-radio>
            </v-radio-group>
            <v-btn
              @click="fillIPAddresses()"
            >Doplnit výchozí nastavení</v-btn>
          </v-col>
        </v-row>
        <div v-show="babybox.network.networkType != 0">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Monitorovací počítač" v-model="babybox.network.ip.pc"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" v-show="babybox.network.networkType == 2">
              <v-text-field label="Monitorovací počítač - brána" v-model="babybox.network.ip.pcGateway"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Router LAN" v-model="babybox.network.ip.routerLAN"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Router WAN" v-model="babybox.network.ip.routerWAN"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Router - brána" v-model="babybox.network.ip.routerGateway"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Jednotka motory" v-model="babybox.network.ip.SDSMotory"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Jednotka topení" v-model="babybox.network.ip.SDSTopeni"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field label="Kamera" v-model="babybox.network.ip.camera"></v-text-field>
            </v-col>
          </v-row>
        </div>
        <h2 class="mx-3">Další informace</h2>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="[
                'Vyber kameru',
                'AVTech',
                'Vivotek',
                'Hikvision'
              ]"
              v-model="babybox.components.camera"
              label="Vyber kameru"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="[
                'Vyber OS',
                'Windows 10 Home',
                'Windows 10 Pro',
                'Windows 8',
                'Windows 7'
              ]"
              v-model="babybox.components.OS"
              label="Vyber operační systém"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="[
                'Vyber PC',
                'Lenovo C20',
                'Samsung',
                'Prestigio',
              ]"
              v-model="babybox.components.PC"
              label="Vyber počítač"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-textarea
              outlined
              v-model="babybox.notes"
              label="Poznámky">
            </v-textarea>
          </v-col>
        </v-row>
        <v-btn class="mx-3" @click="submit">Uložit</v-btn>
      </v-container>
    </v-form>

    <v-btn
      fab
      large
      dark
      bottom
      right
      fixed
      class="v-btn--example"
      router
      :to="{
        name: 'Babybox',
        params: {
          name: this.$route.params.name
        }
      }"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: "EditBabybox",
  data: () => ({
    default: {
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
          //Possible types of network: 0 - not known, 1 - vlan, 2 - routing, 3 - their network, 4 - other
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
      phones: [{
          name: '',
          phoneNumber: '',
          notes: ''
      }],
      notes: ''
    },
    babybox: {},
    loading: true,
    installDateMenu: false,
    lastServisDateMenu: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
      colorBtn: '',
      timeout: 10000
    }
  }),
  created() {
    this.babybox = this.default
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = this._.merge(this.default, babybox)
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    submit: function() {
      fetch(`http://localhost:3000/api/babybox/${this.babybox._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.babybox)
      })
      .then(response => response.json())
      .then(babybox => {
        this.babybox = this._.merge(this.default, babybox)
        this.loading = false;
        this.snackbar.show = true;
        this.snackbar.text = "Informace o babyboxu úspěšně upraveny."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
      })
      .catch(err => {
        this.snackbar.show = true;
        this.snackbar.text = "Vyskytla se chyba při ukládání informací o babyboxu."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        console.log(err);
      });
    },
    fillIPAddresses: function() {
      this.babybox.network.ip = {
        pc: "10.1.1.10/24",
        pcGateway: "10.1.1.1",
        routerLAN: "10.1.1.0/24",
        routerWAN: "",
        routerGateway: "",
        SDSMotory: "10.1.1.5",
        SDSTopeni: "10.1.1.6",
        camera: "10.1.1.7"
      }
    }
  },
};
</script>
