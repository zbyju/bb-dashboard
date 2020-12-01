<template>
  <div id="Data">
    <line-chart v-if="!loadingData" :height="800" />
    <Stats />

    <v-data-table
      v-show="!loadingData"
      :headers="headers"
      :items="data"
      :items-per-page="144"
      :sort-by="['time']"
      :sort-desc="[true]"
      :custom-sort="customSort"
      dense
      class="data-table"
      :footer-props="{
        'items-per-page-options': [{
          text: '3 hodiny', value: 18
        },{
          text: '12 hodin', value: 72
        },{
          text: '1 den', value: 144
        },{
          text: '2 dny', value: 288
        },{
          text: '1 týden', value: 1008
        },{
          text: 'Vše', value: -1
        }],
        'items-per-page-text': 'Počet položek na stránce:',
        'items-per-page-all-text': 'Vše',
      }"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="item in items"
            :key="item._id"
            class="table-row"
          >
            <td>
              <span>{{ item.time }}</span>
            </td>
            <template v-if="item.temperature && item.voltage">
              <td
                v-for="index in 7"
                :key="index"
                :class="getTextColor(getVariable(item, index - 1), index - 1)">
                <span>{{ toFixed(getVariable(item, index - 1), 2) }}</span>
              </td>
              <td :class="{
                    'green--text' : item.status == 0,
                    'red--text' : item.status == 1,
                    'orange--text' : item.status > 1,
                  }">
                {{ statusToString(item.status) }}
              </td>
            </template>
            <template v-else>
              <td
                v-for="index in 7"
                :key="index"
                class="red--text">
                <span>--</span>
              </td>
              <td :class="{
                    'green--text' : item.status == 0,
                    'red--text' : item.status == 1,
                    'orange--text' : item.status > 1,
                  }">
                {{ statusToString(item.status) }}
              </td>
            </template>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <v-btn
      fab
      large
      bottom
      right
      fixed
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

    <v-bottom-sheet v-model="sheet" inset :scrollable="true" @input="v => v || filterData()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          large
          bottom
          right
          fixed
          v-bind="attrs"
          v-on="on"
          class="filterButton blue darken-3"
        >
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </template>
      <v-card class="Data" height="600">
        <v-card-title>Filtry</v-card-title>
        <v-card-text height="300">
          <v-row class="d-flex justify-space-around">
            <v-col cols="12" md="6" lg="4" class="d-flex justify-center">
              <div>
                <v-card-subtitle>Data od:</v-card-subtitle>
                <v-date-picker
                  v-model="filter.from"
                  first-day-of-week="1"
                  locale="cze"
                  :max="filter.to"
                  @change="dateChanged()"></v-date-picker>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="4" class="d-flex justify-center">
              <div>
                <v-card-subtitle>Data do:</v-card-subtitle>
                <v-date-picker
                  v-model="filter.to"
                  first-day-of-week="1"
                  locale="cze"
                  :min="filter.from"
                  @change="dateChanged()"
                  ></v-date-picker>
              </div>
            </v-col>
            <v-col cols="12" md="12" lg="auto">
              <v-card-subtitle>Počet dat:</v-card-subtitle>
              <v-text-field
                v-model="filter.count"
                label="Počet dat"></v-text-field>
              <v-slider
                v-model="filter.count"
                min="0"
                :max="filter.countMax"
                thumb-label
              ></v-slider>
              <v-switch
                v-model="light"
                label="Světlé pozadí"
                @change="changeTheme()"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import LineChart from "../components/DataChart.vue";
import Stats from "../components/Stats";
import moment from "moment";

import statusToString from "../mixins/data/statusToString"
import getVariable from "../mixins/data/getVariable"

export default {
  name: "Data",
  components: { LineChart, Stats },
  mixins: [statusToString, getVariable],
  data: () => ({
    light: false,
    sheet: false,
    filter: {
      from: moment().add(-7, "d").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      count: 10000,
      countMax: 10000
    },
    headers: [
      {
        text: "Čas",
        value: "time",
        class: "white--text title py-2",
        align: "center"
      },
      {
        text: "Teplota venkovní",
        value: "temperature.outside",
        class: "green--text title py-2",
        align: "center"
      },
      {
        text: "Teplota vnitřní",
        value: "temperature.inner",
        class: "orange--text title py-2",
        align: "center"
      },
      {
        text: "Teplota dolní",
        value: "temperature.bottom",
        class: "blue--text title py-2",
        align: "center"
      },
      {
        text: "Teplota horní",
        value: "temperature.top",
        class: "red--text title py-2",
        align: "center"
      },
      {
        text: "Teplota plášť",
        value: "temperature.casing",
        class: "yellow--text text--darken-1 title py-2",
        align: "center"
      },
      {
        text: "Napětí vstupní",
        value: "voltage.in",
        class: "teal--text text--accent-3 title py-2",
        align: "center"
      },
      {
        text: "Napětí akumulátor",
        value: "voltage.battery",
        class: "purple--text title py-2",
        align: "center"
      },
      {
        text: "Status",
        value: "status",
        class: "white--text title py-2",
        align: "center"
      }
    ],
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
      filter: this.filter
    })
  },
  destroyed() {
    this.resetStyles();
  },
  methods: {
    customSort: function(items, index, isDesc) {

      items.sort((a, b) => {
        if(index[0] === "time") {
          let d1 = moment(a.time, "DD.MM.YYYY HH:mm")
          let d2 = moment(b.time, "DD.MM.YYYY HH:mm")
          let diff = d1.diff(d2)
          if(isDesc[0] === false) {
            return diff
          } else {
            return diff * -1
          }
        } else {
          if (isDesc[0] === false) {
            return this._.get(a, index[0]) < this._.get(b, index[0]) ? -1 : 1;
          } else {
            return this._.get(b, index[0]) < this._.get(a, index[0]) ? -1 : 1;
          }
        }
      })
      return items
    },
    toFixed(number, decimals) {
      return number.toFixed(decimals)
    },
    filterData: async function() {
      await this.$store.dispatch("getData", {
        id: this.babybox._id,
        filter: this.filter
      })
    },
    tableRowClass: function(item) {
      return {
        "--text-danger": item.status > 0,
        "--text-warning": item.status < 0
      };
    },
    getTextColor: function(value, index) {
      let colors = {}
      if(index == 0) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [15, 10, 25],
          max: [25, 15, 28]
        }
      } else if(index == 1) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [26, 20, 33],
          max: [33, 26, 36]
        }
      } else if(index == 2 || index == 3) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [15, 10, 45],
          max: [45, 15, 55]
        }
      } else if(index == 4) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [25, 20, 40],
          max: [40, 25, 43]
        }
      } else if(index == 5) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [14.3, 14.0, 14.8],
          max: [14.8, 14.3, 15.1]
        }
      } else if(index == 6) {
        colors = {
          color: ["green--text", "orange--text", "orange--text"],
          min: [13.0, 12.8, 13.8],
          max: [13.8, 13.0, 14.0]
        }
      } else {
        return ""
      }
      for(let i = 0; i < colors.color.length; ++i) {
        if(value >= colors.min[i] && value <= colors.max[i]) {
          return colors.color[i]
        }
      }
      return "red--text"
    },
    dateChanged: function() {
      let from = moment(this.filter.from, "YYYY-MM-DD");
      let to = moment(this.filter.to, "YYYY-MM-DD");
      let diff = to.diff(from, 'days') + 1;
      this.filter.countMax = diff * 144;
      this.filter.count = this.filter.countMax;
    },
    resetStyles: function() {
      document.documentElement.style.setProperty('--black', '#16202a');
      document.documentElement.style.setProperty('--darkGrey', '#192734');
      document.documentElement.style.setProperty('--lightGrey', '#253340');
      document.documentElement.style.setProperty('--darkWhite', '#8899a6');
      document.documentElement.style.setProperty('--white', '#fff');
      document.documentElement.style.setProperty('--border', 'rgba(255, 255, 255, 0.12);');
    },
    changeTheme: function() {
      if(this.light) {
        document.documentElement.style.setProperty('--black', '#fff');
        document.documentElement.style.setProperty('--darkGrey', '#ddd');
        document.documentElement.style.setProperty('--lightGrey', '#ddd');
        document.documentElement.style.setProperty('--darkWhite', '#192734');
        document.documentElement.style.setProperty('--white', '#16202a');
        document.documentElement.style.setProperty('--border', 'rgba(0, 0, 0, 0.12);');
      } else {
        this.resetStyles();
      }
    }
  }
};
</script>

<style lang="scss">
.v-bottom-sheet {
  .v-card.Data {
    .v-picker {
      background: var(--picker1) !important;
      
      .v-picker__body {
        background: rgba(200,200,255,0.07) !important;
      }
    }
    color: var(--white) !important;

    .v-card__subtitle, .theme--dark.v-input .v-label, .theme--dark.v-input input {
      color: var(--white) !important;
    }
  }
}

#Data {
  .theme--dark.v-data-table
    tbody
    tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: var(--lightGrey) !important;
  }

  .theme--dark {
    .v-select, .v-icon, .v-btn {
      color: var(--white) !important;
    }

    .mdi-filter.v-icon, .mdi-arrow-left.v-icon {
      color: #fff !important;
    }

    .v-data-footer {
      border-top: thin solid var(--border) !important;
    }
  }

  .v-select__selection--comma{
    color: var(--white)
  }

  .filterButton {
    bottom: 90px;
  }

  .data-table {
    th {
      padding: 0;
      justify-content: center;
      span {
        margin: auto;
      }
      text-align: center;
    }
    .table-row {
      td {
        padding: 3px 0;
        margin: 0 5px;
        font-size: 15px;
        text-align: center;
        span {
          margin-right: 18px;
        }
      }
    }

  }
}
</style>
