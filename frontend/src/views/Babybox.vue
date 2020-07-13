<template>
  <div class="help">
    <v-img src="@/assets/img/defaultBabyboxBackground.jpg" max-height="500"></v-img>
    <Stats :stats="statsFormatted"/>

    <v-container>
        <v-row>
          <v-col
            md="4"
            sm="12"
            xs="12"
            order-md="last"
            order-sm="first">
            <v-card>
              <v-card-title>Možnosti</v-card-title>
              <v-card-actions>
                <v-row>
                  <v-col cols="auto" xs="12">
                    <v-btn>Galerie</v-btn>
                  </v-col>
                  <v-col cols="auto" xs="12">
                    <v-btn>Upravit</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-card-actions>
                <v-row>
                  <v-col cols="auto" xs="12">
                    <v-btn>Všechna data</v-btn>
                  </v-col>
                  <v-col cols="auto" xs="12">
                    <v-btn outlined>Teploty</v-btn>
                  </v-col>
                  <v-col cols="auto" xs="12">
                    <v-btn outlined>Napětí</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col
            md="8"
            sm="12"
            xs="12">
            <v-card>
              <v-card-title>Upozornění</v-card-title>
              <v-card-text>
                <v-skeleton-loader
                  :loading="loading"
                  type="paragraph"
                >
                  <span>Žádné upozornění</span>
                </v-skeleton-loader>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
    </v-container>
  </div>
</template>
<script>
import Stats from '../components/Stats'

export default {
  name: "Babybox",
  components: {
    Stats
  },
  data: () => ({
    babybox: null,
    data: null,
    stats: {
      sensors:[],
      status: {
        quality: 0,
        quality100: 0,
      },
      count: 0
    },
    statsFormatted: null,
    loading: true
  }),
  created() {
    fetch(`http://localhost:3000/api/babybox/name/${this.$route.params.name}`)
      .then(response => response.json())
      .then(babybox => {
        this.babybox = babybox;

        fetch(`http://localhost:3000/api/data/babybox/${babybox._id}`)
          .then(response => response.json())
          .then(data => {
            this.data = data;
            this.loading = false;
            this.findStats()
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
    findStats: function() {
      for(let i = 0; i < 7; ++i) {
        let tmpObject = { max: -1000, min: 1000, avg: 0 };
        this.stats.sensors.push(tmpObject);
      }

      this.data.forEach((val, i) => {
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
          console.log(this.stats.status.quality100)
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
};
</script>
