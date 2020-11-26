<script>
  import { Radar } from 'vue-chartjs'

  export default {
    extends: Radar,
    computed: {
      chartdata() {
        return this.$store.state.data.active
      }
    },
    data () {
      return {
        chartData: {
          labels: ["Celková stabilita","Aktuální stabilita",
          "Venkovní teplota", "Vnitřní teplota", "Akumulátor"],
          datasets: [{
              borderWidth: 1,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
             
              data: []
            }
          ]
        },
        options: {
          scale: {
              ticks: {
                  callback: function() {return ""},
                  backdropColor: "rgba(0, 0, 0, 0)",
                  min: 0,
                  max: 100
              },
              pointLabels:{
                fontColor: "#fff",
                fontSize: 12
              },
              gridLines: {
                color: "rgba(255, 255, 255, 0.25)"
              }
          },
          legend: {
              display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false
      }
    },
    methods: {
      renderRadarChart: function() {
        let quality = {
          value: 0,
        }
        let qualityLatest = {
          value: 0,
          OK: 0,
          timePeriod: 144 * 7
        }
        let temperatureOutside = {
          value: 0,
          minIdeal: 10,
          maxIdeal: 28,
          deviationAvg: 0,
          qualityMultiplier: 12
        }
        let temperatureInner = {
          value: 0,
          minIdeal: 20,
          maxIdeal: 36,
          deviationAvg: 0,
          qualityMultiplier: 15
        }
        let voltageBattery = {
          value: 0,
          avg: 0,
          maxDeviation: 0.1,
          countOK: 0,
          qualityMultiplier: 50
        }
        let count = 0
        let countOK = 0

        if(!this.chartdata || this.chartdata.length == 0) {
          return
        }

        this.chartdata.forEach(x => {
          if(x.status != 1 && x.temperature && x.voltage) {
            //Inner temp
            if(x.temperature.inner > temperatureInner.maxIdeal) {
              temperatureInner.deviationAvg += Math.abs(x.temperature.inner - temperatureInner.maxIdeal)
            } else if(x.temperature.inner < temperatureInner.minIdeal) {
              temperatureInner.deviationAvg += Math.abs(x.temperature.inner - temperatureInner.minIdeal) 
            }

            //Outside temp
            if(x.temperature.outside > temperatureOutside.maxIdeal) {
              temperatureOutside.deviationAvg += Math.abs(x.temperature.outside - temperatureOutside.maxIdeal) 
            } else if(x.temperature.inner < temperatureOutside.minIdeal) {
              temperatureOutside.deviationAvg += Math.abs(x.temperature.outside - temperatureOutside.minIdeal) 
            }
            
            //Voltage average
            voltageBattery.avg += x.voltage.battery

            //Quality latest
            if(count < qualityLatest.timePeriod) { //Last week
              ++qualityLatest.OK
            } 

            ++countOK
          }
          ++count
        })

        //Calculate averages
        if(countOK > 0) {
          temperatureInner.deviationAvg = temperatureInner.deviationAvg / countOK
          temperatureOutside.deviationAvg = temperatureOutside.deviationAvg / countOK
          voltageBattery.avg = voltageBattery.avg / countOK

          qualityLatest.value = qualityLatest.OK * 100 / Math.min(qualityLatest.timePeriod, count)
          quality.value = countOK * 100 / count
        }

        //Voltage deviation count
        this.chartdata.forEach(x => {
          if(x.status != 1 && x.voltage && Math.abs(x.voltage.battery - voltageBattery.avg) <= voltageBattery.maxDeviation) {
            ++voltageBattery.countOK
          }
        })

        if(countOK > 0) {
          temperatureInner.value = Math.max(0, 100 - temperatureInner.deviationAvg * temperatureInner.qualityMultiplier)
          temperatureOutside.value = Math.max(0, 100 - temperatureOutside.deviationAvg * temperatureOutside.qualityMultiplier)
          voltageBattery.value = voltageBattery.countOK * 100 / countOK
        }

        this.chartData.datasets[0].data = [quality.value, qualityLatest.value,
        temperatureOutside.value, temperatureInner.value, voltageBattery.value]

        this.renderChart(this.chartData, this.options)
      }
    },
    mounted () {
      this.renderRadarChart()
    },
    watch: {
      chartdata: function() {
        this.renderRadarChart()
      }
    }
  }
</script>