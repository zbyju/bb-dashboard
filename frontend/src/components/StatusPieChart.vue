<script>
  import { Pie } from 'vue-chartjs'

  export default {
    extends: Pie,
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
      renderPieChart: function() {
        let data = [0,0,0,0,0]
        if(!this.chartdata || this.chartdata.length == 0) {
          return
        }
        this.chartdata.forEach(x => {
          ++data[x.status]
        })
        let chartData = {
          labels: ["OK", "Chyba", "Varování - čas", "Varování - data", "Varování - server"],
          datasets: [{
            borderWidth: 0,
            backgroundColor: [
            '#46dd1c',
            '#d61d27',
            'rgba(255, 135, 0, 1)',
            'rgba(255, 179, 0, 1)',
            'rgba(255, 204, 0, 1)',
            ],
            data
          }]
        }
        this.renderChart(chartData, this.options)
      }
    },
    mounted () {
      this.renderPieChart()
    },
    watch: {
      chartdata: function() {
        this.renderPieChart()
      }
    }
  }
</script>