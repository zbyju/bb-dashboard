<script>
  import { Bar } from 'vue-chartjs'
  import moment from 'moment'

  import getVariable from "../mixins/data/getVariable"

  export default {
    extends: Bar,
    props: ["variable"],
    mixins: [getVariable],
    computed: {
      chartdata() {
        return this.$store.state.data.active
      }
    },
    data () {
      return {
        options: {
          legend: {
            display: true
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    methods: {
      renderBarChart: function() {
        let averages = []
        let maximums = []
        let minimums = []
        let count = []
        if(!this.chartdata || this.chartdata.length == 0) {
          return
        }
        for(let i = 0; i < 12; ++i) {
          averages[i] = 0
          count[i] = 0
          minimums[i] = Number.MAX_SAFE_INTEGER
          maximums[i] = Number.MIN_SAFE_INTEGER
        }
        this.chartdata.forEach(x => {
          let month = moment(x.time, "DD.MM.YYYY HH:mm").get("month")
          if(x.status != 1 && x.temperature && x.voltage) {
            let val = this.getVariable(x, this.variable)
            averages[month] += val
            if(val < minimums[month]) {
              minimums[month] = val
            }
            if(val > maximums[month]) {
              maximums[month] = val
            }
            ++count[month];
          }
        })
        for(let i = 0; i < 12; ++i) {
          averages[i] = averages[i] / count[i]
          if(maximums[i] == Number.MIN_SAFE_INTEGER) {
            maximums[i] = 0
          }
          if(minimums[i] == Number.MAX_SAFE_INTEGER) {
            minimums[i] = 0
          }
        }
        let chartData = {
          labels: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
          datasets: [{
            label: "Minimum",
            backgroundColor: "#00ddff",
            data: minimums
          },{
            label: "Průměr",
            backgroundColor: "#46dd1c",
            data: averages
          },{
            label: "Maximum",
            backgroundColor: "#d61d27",
            data: maximums
          }]
        }
        this.renderChart(chartData, this.options)
      }
    },
    mounted () {
      this.renderBarChart()
    },
    watch: {
      chartdata: function() {
        this.renderBarChart();
      },
      variable: function() {
        this.renderBarChart();
      }
    }
  }
</script>