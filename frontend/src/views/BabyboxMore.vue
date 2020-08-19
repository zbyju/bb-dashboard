<template>
  <div class="BabyboxMore">
    <v-img src="@/assets/img/defaultBabyboxBackground.jpg" max-height="500">
    </v-img>
    <Stats />

    <v-container class="main my-8">
      <v-row>
          <v-col>
            <h1>Babybox {{ babybox.customName}}</h1>
          </v-col>
      </v-row>

      <v-row class="justify-space-around">
        <template>
          <v-col style="width:500px; max-width: 600px;" class="mx-5">
            <BabyboxRadarChart />
          </v-col>
        </template>

        <template v-if="isAddressDefined()">
          <v-col cols="auto flex-grow-1">
            <v-card shaped elevation="7">
              <v-card-title>Adresa</v-card-title>
              <v-card-text>
                <v-list-item two-line v-if="babybox.address.hospitalName">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.address.hospitalName }}</v-list-item-title>
                    <v-list-item-subtitle>Nemocnice</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.address.city">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.address.city }}</v-list-item-title>
                    <v-list-item-subtitle>Město</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.address.street">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.address.street }}</v-list-item-title>
                    <v-list-item-subtitle>Ulice</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.address.postcode">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.address.postcode }}</v-list-item-title>
                    <v-list-item-subtitle>PSČ</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <template v-if="babybox.network && babybox.network.networkType && babybox.network.ip">
          <v-col cols="auto flex-grow-1">
            <v-card shaped elevation="7">
              <v-card-title>Nastavení internetu</v-card-title>
              <v-card-text>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title>{{ networkTypeToString(babybox.network.networkType) }}</v-list-item-title>
                    <v-list-item-subtitle>Typ sítě</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.pc">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.pc }}</v-list-item-title>
                    <v-list-item-subtitle>IP Počítače</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.pcGateway">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.pcGateway }}</v-list-item-title>
                    <v-list-item-subtitle>GW Počítače</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.routerLAN">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.routerLAN }}</v-list-item-title>
                    <v-list-item-subtitle>Router LAN</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.routerWAN">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.routerWAN }}</v-list-item-title>
                    <v-list-item-subtitle>Router WAN</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.routerGateway">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.routerGateway }}</v-list-item-title>
                    <v-list-item-subtitle>Router Gateway</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.SDSMotory">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.SDSMotory }}</v-list-item-title>
                    <v-list-item-subtitle>SDS Motory</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.SDSTopeni">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.SDSTopeni }}</v-list-item-title>
                    <v-list-item-subtitle>SDS Topení</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.network.ip.camera">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.network.ip.camera }}</v-list-item-title>
                    <v-list-item-subtitle>Kamera</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <template v-if="isComponentsDefined()">
          <v-col cols="auto flex-grow-1">
            <v-card shaped elevation="7">
              <v-card-title>Komponenty</v-card-title>
              <v-card-text>
                <v-list-item two-line v-if="babybox.components.camera">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.components.camera }}</v-list-item-title>
                    <v-list-item-subtitle>Kamera</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.components.OS">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.components.OS }}</v-list-item-title>
                    <v-list-item-subtitle>Operační systém</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item two-line v-if="babybox.components.PC">
                  <v-list-item-content>
                    <v-list-item-title>{{ babybox.components.PC }}</v-list-item-title>
                    <v-list-item-subtitle>Počítač</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <template v-if="babybox.contacts && babybox.contacts.length > 0">
          <v-col cols="auto flex-grow-1">
            <v-card shaped elevation="7">
              <v-card-title>Kontakty</v-card-title>
              <v-card-text>
                <v-list-item two-line v-for="(contact, i) in babybox.contacts" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-if="contact.name">{{ contact.name }}</v-list-item-title>
                    <v-list-item-subtitle v-if="contact.phoneNumber"><a :href="`tel:${contact.phoneNumber}`">{{ contact.phoneNumber }}</a></v-list-item-subtitle>
                    <v-list-item-subtitle v-if="contact.email"><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></v-list-item-subtitle>
                    <v-list-item-subtitle v-if="contact.notes">{{ contact.notes }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <template v-if="babybox.notes">
          <v-col cols="auto flex-grow-1">
            <v-card shaped elevation="7">
              <v-card-title>Poznámky</v-card-title>
              <v-card-text>
                {{ babybox.notes }}
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>



    <v-container>
      <v-row>
        <v-col>
          <v-card :elevation="7">
            <v-card-title>Graf statusu dat</v-card-title>
            <StatusPieChart />
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card :elevation="7">
            <v-row class=" justify-space-between">
              <v-col cols="auto">
                <v-card-title>Teploty v jednotlivých měsících</v-card-title>
              </v-col>
              <v-col cols="12" sm="4" class="mt-2 mr-3 px-6">
                <v-select
                  :items="[
                    { text: 'Teplota vnitřní', value: 0 },
                    { text: 'Teplota venkovní', value: 1 },
                    { text: 'Teplota dolní', value: 2 },
                    { text: 'Teplota horní', value: 3 },
                    { text: 'Teplota pláště', value: 4 },
                    { text: 'Napětí vstupní', value: 5 },
                    { text: 'Napětí akumulátor', value: 6 },
                  ]"
                  label="Proměnná"
                  item-value="value"
                  item-text="text"
                  v-model="temperatureBarChartVariable"
                ></v-select>
              </v-col>
            </v-row>
            <TemperatureBarChart :variable="temperatureBarChartVariable" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import moment from "moment"
import Stats from "../components/Stats"
import Notifications from "../components/Notifications"

import StatusPieChart from "../components/StatusPieChart"
import BabyboxRadarChart from "../components/BabyboxRadarChart"
import TemperatureBarChart from "../components/TemperatureBarChart"

export default {
  name: "BabyboxMore",
  components: {
    Stats,
    StatusPieChart,
    TemperatureBarChart,
    BabyboxRadarChart
  },
  data: () => ({
    temperatureBarChartVariable: 0,
  }),
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    },
    data() {
      return this.$store.state.data.active
    },
    loading() {
      return this.$store.state.babybox.loading
    },
    loadingData() {
      return this.$store.state.data.loading
    }
  },
  async mounted() {
    await this.$store.dispatch("getBabybox", {
      name: this.$route.params.name
    })
    await this.$store.dispatch("getData", {
      id: this.babybox._id,
      filter: {
        from: moment().add(-10, 'years').format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD")
      }
    })
  },
  methods: {
    networkTypeToString: function(val) {
      if(val == 0) {
        return "Nevyplněno"
      } else if(val == 1) {
        return "VLAN"
      } else if(val == 2) {
        return "Směrování"
      } else if(val == 3) {
        return "V síti nemocnice"
      }
    },
    isAddressDefined() {
      return (this.babybox.address && this.babybox.address != {} &&
              this.babybox.address.hospitalName != "" &&
              this.babybox.address.city != "" &&
              this.babybox.address.street != "" &&
              this.babybox.address.postcode != "")
    },
    isComponentsDefined() {
      return (this.babybox.components && this.babybox.components != {} &&
              this.babybox.components.camera != "" &&
              this.babybox.components.OS != "" &&
              this.babybox.components.PC != "")
    }
  }
};
</script>

<style lang="scss">
</style>
