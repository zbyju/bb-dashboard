<template>
  <div>
    <line-chart
      v-if="!loading"
      :chartdata="data"
      :options="options"
      />
    <Stats :stats="statsFormatted"/>

    <v-data-table
      v-show="!loading"
      :headers="headers"
      :items="activeData"
      :items-per-page="100"
      :sort-by="['time']"
      :sort-desc="[true]"
      dense
      class="data-table"
    >
    
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item._id" :class="[tableRowClass(item), 'table-row']">
          <td>
            <span>{{ item.time }}</span>
          </td>
          <td
            :class="{ 'red--text': item.temperature.inner > 37 || item.temperature.inner < 20 }"
          >
            <span>{{ item.temperature.inner }}</span>
          </td>
          <td
            :class="{ 'red--text': item.temperature.outside > 40 || item.temperature.outside < 10 }"
          >
            <span>{{ item.temperature.outside }}</span>
          </td>
          <td
            :class="{ 'red--text': item.temperature.bottom > 45 || item.temperature.bottom < 15 }"
          >
            <span>{{ item.temperature.bottom }}</span>
          </td>
          <td
            :class="{ 'red--text': item.temperature.top > 45 || item.temperature.top < 15 }"
          >
            <span>{{ item.temperature.top }}</span>
          </td>
          <td
            :class="{ 'red--text': item.temperature.casing > 37 || item.temperature.casing < 20 }"
          >
            <span>{{ item.temperature.casing }}</span>
          </td>
          <td
            :class="{ 'red--text': item.voltage.in > 13 || item.voltage.in < 10 }"
          >
            <span>{{ item.voltage.in }}</span>
          </td>
          <td
            :class="{ 'red--text': item.voltage.battery > 13 || item.voltage.battery < 10 }"
          >
            <span>{{ item.voltage.battery }}</span>
          </td>
          <td>{{ statusText(item.status) }}</td>
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
import LineChart from "../components/DataChart.vue"
import Stats from "../components/Stats"
import moment from "moment"

export default {
  name: "Data",
  components: { LineChart, Stats },
  data: () => ({
    loading: true,
    babybox: {},
    data: [],
    options: {},
    stats: {
      sensors:[],
      status: {
        quality: 0,
        quality100: 0,
      },
      count: 0
    },
    statsFormatted: null,
    headers: [
      { text: "Čas", value: "time", class: "white--text title py-2", align: "center" },
      { text: "Teplota vnitřní", value: "temperature.inner", class: "orange--text title py-2", align: "center" },
      { text: "Teplota venkovní", value: "temperature.outside", class: "green--text title py-2", align: "center" },
      { text: "Teplota dolní", value: "temperature.bottom", class: "blue--text title py-2", align: "center" },
      { text: "Teplota horní", value: "temperature.top", class: "red--text title py-2", align: "center" },
      { text: "Teplota plášť", value: "temperature.casing", class: "yellow--text title py-2", align: "center" },
      { text: "Napětí vstupní", value: "voltage.in", class: "white--text title py-2", align: "center" },
      { text: "Napětí akumulátor", value: "voltage.battery", class: "purple--text title py-2", align: "center" },
      { text: "Status", value: "status", class: "white--text title py-2", align: "center" },
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
      }
    },
    activeData: []
  }),
  created() {
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;

        moment()

        fetch(`http://localhost:3000/api/data/babybox/${babybox._id}`)
          .then(response => response.json())
          .then(data => {
            this.data = data;
            this.loading = false;
            this.goThroughData();
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
    tableRowClass: function(item) {
      return {
        "--text-danger": item.status > 0,
        "--text-warning": item.status < 0
      }
    },
    statusText: function(status) {
      if(status == 0) {
        return "OK";
      } else if(status == 1) {
        return "Chyba"
      } else {
        return "???";
      }
    },
    getVariable: function(val, index) {
      if(index == 0) {
        return val.temperature.outside;
      } else if(index == 1) {
        return val.temperature.inner;
      } else if(index == 2) {
        return val.temperature.bottom;
      } else if(index == 3) {
        return val.temperature.top;
      } else if(index == 4) {
        return val.temperature.casing;
      } else if(index == 5) {
        return val.voltage.in;
      } else if(index == 6) {
        return val.voltage.battery;
      }
    },
    goThroughData: function() {
      for(let i = 0; i < 7; ++i) {
        let tmpObject = { max: -1000, min: 1000, avg: 0 };
        this.stats.sensors.push(tmpObject);
      }

      this.data.forEach((val, i) => {
        val.time = moment(val.time).format("DD.MM.YYYY HH:mm");
        const mergedData = this._.merge(this.defaultData(), val);
        this.activeData.push(mergedData);

        //Find stats can be called here
        if(val.status == 0) {
          ++this.stats.status.quality;
          if(i < 100) {
            ++this.stats.status.quality100;
          }
        }
        for(let j = 0; j < 7; ++j) {
          if(this.getVariable(val, j) > this.stats.sensors[j].max) {
            this.stats.sensors[j].max = this.getVariable(val, j).toFixed(2);
          }
          if(this.getVariable(val, j) < this.stats.sensors[j].min) {
            this.stats.sensors[j].min = this.getVariable(val, j).toFixed(2);
          }
          this.stats.sensors[j].avg += this.getVariable(val, j);
        }
        ++this.stats.count;
      })
      if(this.stats.count > 0) {
        for(let j = 0; j < 7; ++j) {
          this.stats.sensors[j].avg = (this.stats.sensors[j].avg / this.stats.count).toFixed(2);
        }
        this.stats.status.quality = (this.stats.status.quality * 100 / this.stats.count).toFixed(0);
        if(this.stats.count < 100) {
          this.stats.status.quality100 = (this.stats.status.quality100 * 100 / this.stats.count).toFixed(0);
        }
      }
      this.formatStats()
    },
    formatStats: function() {
      this.statsFormatted = [
        { icon: "mdi-pound", text: "Počet dat", value: this.stats.count, unit: "" },
        { icon: "mdi-percent", text: "Kvalita", value: this.stats.status.quality, unit: "%" },
        { icon: "mdi-percent", text: "Kvalita / 100", value: this.stats.status.quality100, unit: "%" },
        { icon: "mdi-arrow-down-thick", text: "Aku", value: this.stats.sensors[6].min, unit: "V" },

        { icon: "mdi-arrow-up-thick", text: "Vnitřní", value: this.stats.sensors[1].max, unit: "°C" },
        { icon: "mdi-arrow-down-thick", text: "Vnitřní", value: this.stats.sensors[1].min, unit: "°C" },
        { icon: "mdi-diameter-variant", text: "Vnitřní", value: this.stats.sensors[1].avg, unit: "°C" },
        { icon: "mdi-arrow-up-thick", text: "Venkovní", value: this.stats.sensors[0].max, unit: "°C" },
        { icon: "mdi-arrow-down-thick", text: "Venkovní", value: this.stats.sensors[0].min, unit: "°C" },
        { icon: "mdi-diameter-variant", text: "Venkovní", value: this.stats.sensors[0].avg, unit: "°C" },

        
        { icon: "mdi-arrow-up-thick", text: "Dolní", value: this.stats.sensors[2].max, unit: "°C" },
        { icon: "mdi-arrow-down-thick", text: "Dolní", value: this.stats.sensors[2].min, unit: "°C" },
        { icon: "mdi-diameter-variant", text: "Dolní", value: this.stats.sensors[2].avg, unit: "°C" },

        { icon: "mdi-arrow-up-thick", text: "Horní", value: this.stats.sensors[3].max, unit: "°C" },
        { icon: "mdi-arrow-down-thick", text: "Horní", value: this.stats.sensors[3].min, unit: "°C" },
        { icon: "mdi-diameter-variant", text: "Horní", value: this.stats.sensors[3].avg, unit: "°C" },

        { icon: "mdi-arrow-up-thick", text: "Plášť", value: this.stats.sensors[4].max, unit: "°C" },
        { icon: "mdi-arrow-down-thick", text: "Plášť", value: this.stats.sensors[4].min, unit: "°C" },
        { icon: "mdi-diameter-variant", text: "Plášť", value: this.stats.sensors[4].avg, unit: "°C" },

        { icon: "mdi-arrow-up-thick", text: "In", value: this.stats.sensors[5].max, unit: "V" },
        { icon: "mdi-arrow-down-thick", text: "In", value: this.stats.sensors[5].min, unit: "V" },
        { icon: "mdi-diameter-variant", text: "In", value: this.stats.sensors[5].avg, unit: "V" },

        { icon: "mdi-arrow-up-thick", text: "Aku", value: this.stats.sensors[6].max, unit: "V" },
        { icon: "mdi-diameter-variant", text: "Aku", value: this.stats.sensors[6].avg, unit: "V" },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.theme--dark.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: var(--lightGrey) !important;
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
</style>
