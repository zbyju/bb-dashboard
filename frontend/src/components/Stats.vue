<template>
  <div id="Stats">
    <div v-if="data.length == 0" id="no-data">
      <h3>Žádné data</h3>
    </div>
    <div v-else>
      <div class="statRow headers">
        <div class="statCell header" v-for="(stat, i) in statsFormatted" :key="i">
          <v-icon>{{ stat.icon }}</v-icon>
          <span>{{ stat.text }}</span>
        </div>
      </div>
      <div class="statRow stats">
        <div class="statCell stat" v-for="(stat, i) in statsFormatted" :key="i">
          <span>{{ stat.value }}{{ stat.unit }}</span>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import getVariable from "../mixins/data/getVariable"

export default {
  name: "Stats",
  mixins: [getVariable],
  data() {
    return {
      defaultStats: {
        sensors: [],
        status: {
          quality: 0,
          quality100: 0
        },
        countAll: 0,
        countOk: 0,
      },
      stats: {},
      statsFormatted: null,
    }
  },
  computed: {
    data() {
      return this.$store.state.data.active
    }
  },
  mounted() {
    if(this.data && this.data.length > 0) {
      this.calculateStats()  
    }
  },
  watch: {
    data: function() {
      if(this.data && this.data.length > 0) {
        this.calculateStats()
      }
    }
  },
  methods: {
    calculateStats: function() {
      this.stats = JSON.parse(JSON.stringify(this.defaultStats));

      if(this.data.length < 1) {
        for (let i = 0; i < 7; ++i) {
          let tmpObject = { max: "-", min: "-", avg: "-" };
          this.stats.sensors.push(tmpObject);
        }
        return
      }

      for (let i = 0; i < 7; ++i) {
        let tmpObject = { max: -1000, min: 1000, avg: 0 };
        this.stats.sensors.push(tmpObject);
      }

      this.data.forEach((val, i) => {
        if(val.temperature && val.voltage) {
          //Find stats can be called here
          if (val.status != 1) {
            ++this.stats.status.quality;
            if (i < 1008) {
              ++this.stats.status.quality100;
            }
          }
          for (let j = 0; j < 7; ++j) {
            if (this.getVariable(val, j) > this.stats.sensors[j].max) {
              this.stats.sensors[j].max = this.getVariable(val, j).toFixed(2);
            }
            if (this.getVariable(val, j) < this.stats.sensors[j].min) {
              this.stats.sensors[j].min = this.getVariable(val, j).toFixed(2);
            }
            this.stats.sensors[j].avg += this.getVariable(val, j);
          }
          ++this.stats.countOk;
        }
        ++this.stats.countAll
      });
      if (this.stats.countOk > 0) {
        for (let j = 0; j < 7; ++j) {
          this.stats.sensors[j].avg = (
            this.stats.sensors[j].avg / this.stats.countOk
          ).toFixed(2);
        }
      }
      if(this.stats.countAll > 0) {
        this.stats.status.quality = (
          (this.stats.status.quality * 100) / this.stats.countAll
        ).toFixed(0);
        this.stats.status.quality100 = (
          this.stats.status.quality100 * 100 / Math.min(1008, this.stats.countAll)
        ).toFixed(0);
      }
      this.formatStats();
    },
    formatStats: function() {
      this.statsFormatted = [
        {
          icon: "mdi-pound",
          text: "Počet dat",
          value: this.stats.countAll,
          unit: ""
        },
        {
          icon: "mdi-medal",
          text: "Kvalita",
          value: this.stats.status.quality,
          unit: "%"
        },
        {
          icon: "mdi-medal-outline",
          text: "Kvalita / týden",
          value: this.stats.status.quality100,
          unit: "%"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Aku",
          value: this.stats.sensors[6].min,
          unit: "V"
        },

        {
          icon: "mdi-arrow-up-thick",
          text: "Vnitřní",
          value: this.stats.sensors[1].max,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Vnitřní",
          value: this.stats.sensors[1].min,
          unit: "°C"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Vnitřní",
          value: this.stats.sensors[1].avg,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-up-thick",
          text: "Venkovní",
          value: this.stats.sensors[0].max,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Venkovní",
          value: this.stats.sensors[0].min,
          unit: "°C"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Venkovní",
          value: this.stats.sensors[0].avg,
          unit: "°C"
        },

        {
          icon: "mdi-arrow-up-thick",
          text: "Dolní",
          value: this.stats.sensors[2].max,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Dolní",
          value: this.stats.sensors[2].min,
          unit: "°C"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Dolní",
          value: this.stats.sensors[2].avg,
          unit: "°C"
        },

        {
          icon: "mdi-arrow-up-thick",
          text: "Horní",
          value: this.stats.sensors[3].max,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Horní",
          value: this.stats.sensors[3].min,
          unit: "°C"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Horní",
          value: this.stats.sensors[3].avg,
          unit: "°C"
        },

        {
          icon: "mdi-arrow-up-thick",
          text: "Plášť",
          value: this.stats.sensors[4].max,
          unit: "°C"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "Plášť",
          value: this.stats.sensors[4].min,
          unit: "°C"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Plášť",
          value: this.stats.sensors[4].avg,
          unit: "°C"
        },

        {
          icon: "mdi-arrow-up-thick",
          text: "In",
          value: this.stats.sensors[5].max,
          unit: "V"
        },
        {
          icon: "mdi-arrow-down-thick",
          text: "In",
          value: this.stats.sensors[5].min,
          unit: "V"
        },
        {
          icon: "mdi-diameter-variant",
          text: "In",
          value: this.stats.sensors[5].avg,
          unit: "V"
        },
        {
          icon: "mdi-arrow-up-thick",
          text: "Aku",
          value: this.stats.sensors[6].max,
          unit: "V"
        },
        {
          icon: "mdi-diameter-variant",
          text: "Aku",
          value: this.stats.sensors[6].avg,
          unit: "V"
        }
      ];
    }
  }
}
</script>

<style lang="scss" scoped>
  #Stats {
    background: var(--darkGrey);
    display: flex;
    flex-direction: column;

    box-shadow: 0px -2px 0px var(--primary) inset;

    #no-data {
      height: 65px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h3 {
        text-align: center;
        color: var(--darkWhite);
      }
    }

    .statRow {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow: hidden;

      .statCell {
        width: 118px;
        max-height: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;

        span {
          display: inline-flex;
          align-items: center;
        }
      }
    }

    .headers {
      height: 30px;
      .header {
        height: 200px;
        padding-top: 10px;
        font-size: 14px;
        color: var(--darkWhite);
        
        span {
          padding-top: 2px;
          margin: 0 0 0 5px;
        }

        .v-icon {
          color: var(--darkWhite)
        }
      }

    }

    .stats {
      height: 35px;
      .stat {
        margin-top: -3px;
        height: 200px;
        color: var(--primary);

        span {
          font-size: 20px;
          font-weight: 500;
        }
      }
    }
  }
</style>
