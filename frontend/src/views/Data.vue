<template>
  <div id="Data">
    <line-chart v-if="!loading" :chartdata="data" :options="options" />
    <Stats :data="data" />

    <v-data-table
      v-show="!loading"
      :headers="headers"
      :items="data"
      :items-per-page="144"
      :sort-by="['time']"
      :sort-desc="[true]"
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
            <td
              v-for="index in 7"
              :key="index"
              :class="getTextColor(getVariable(item, index - 1), index - 1)">
              <span>{{ getVariable(item, index - 1) }}</span>
            </td>
            <td :class="{
                  'green--text' : item.status == 0,
                  'red--text' : item.status == 1,
                  'orange--text' : item.status > 1,
                }">
              {{ statusText(item.status) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <v-btn
      fab
      large
      dark
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

    <v-bottom-sheet v-model="sheet" inset @input="v => v || filterData()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          large
          dark
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
      <v-card>
        <v-card-title>Filtry</v-card-title>
        <v-row class="d-flex justify-space-around">
          <v-col cols="auto">
            <v-card-subtitle>Data od:</v-card-subtitle>
            <v-date-picker
              v-model="filter.from"
              first-day-of-week="1"
              locale="cze"
              :max="filter.to"
              @change="dateChanged()"></v-date-picker>
          </v-col>
          <v-col cols="auto">
            <v-card-subtitle>Data do:</v-card-subtitle>
            <v-date-picker
              v-model="filter.to"
              first-day-of-week="1"
              locale="cze"
              :min="filter.from"
              @change="dateChanged()"
              ></v-date-picker>
          </v-col>
          <v-col cols="2">
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
          </v-col>
        </v-row>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import LineChart from "../components/DataChart.vue";
import Stats from "../components/Stats";
import moment from "moment";

export default {
  name: "Data",
  components: { LineChart, Stats },
  data: () => ({
    loading: true,
    sheet: false,
    babybox: {},
    options: {},
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
        class: "yellow--text title py-2",
        align: "center"
      },
      {
        text: "Napětí vstupní",
        value: "voltage.in",
        class: "white--text title py-2",
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
    defaultData: function() {
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
      };
    },
    data: []
  }),
  created() {
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;

        fetch(`http://localhost:3000/api/data/babybox/${babybox._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
          })
          .then(response => response.json())
          .then(data => {
            this.data = [];
            data.forEach(val => {
              val.time = moment(val.time).format("DD.MM.YYYY HH:mm");
              const mergedData = this._.merge(this.defaultData(), val);
              this.data.push(mergedData);
            })
            this.filter.countMax = this.filter.count = data.length;
            this.loading = false;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    getVariable: function(val, index) {
      if (index == 0) {
        return val.temperature.outside;
      } else if (index == 1) {
        return val.temperature.inner;
      } else if (index == 2) {
        return val.temperature.bottom;
      } else if (index == 3) {
        return val.temperature.top;
      } else if (index == 4) {
        return val.temperature.casing;
      } else if (index == 5) {
        return val.voltage.in;
      } else if (index == 6) {
        return val.voltage.battery;
      }
    },
    filterData: function() {
      fetch(`http://localhost:3000/api/data/babybox/${this.babybox._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.filter)
      })
      .then(response => response.json())
      .then(data => {
        this.data = [];
        data.forEach(val => {
          val.time = moment(val.time).format("DD.MM.YYYY HH:mm");
          const mergedData = this._.merge(this.defaultData(), val);
          this.data.push(mergedData);
        })
        this.filter.countMax = this.filter.count = data.length;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
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
    statusText: function(status) {
      if (status == 0) {
        return "OK";
      } else if (status == 1) {
        return "Chyba";
      } else if (status == 2) {
        return "Varování - čas";
      } else if (status == 3) {
        return "Varování - data";
      } else {
        return "???"
      }
    },
    dateChanged: function() {
      let from = moment(this.filter.from, "YYYY-MM-DD");
      let to = moment(this.filter.to, "YYYY-MM-DD");
      let diff = to.diff(from, 'days') + 1;
      console.log("rozdil dnu: " + diff)
      this.filter.countMax = diff * 144;
      this.filter.count = this.filter.countMax;
    },
  }
};
</script>

<style lang="scss">
.v-picker {
  background: var(--lightGrey) !important;
  
  .v-picker__body {
    background: rgba(200,200,255,0.07) !important;
  }
}

#Data {
  .theme--dark.v-data-table
    tbody
    tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: var(--lightGrey) !important;
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
