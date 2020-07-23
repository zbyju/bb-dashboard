<script>
import { Line } from 'vue-chartjs'
import moment from 'moment'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    labels: [],
    temperatureOutside: null,
    temperatureInner: null,
    temperatureBottom: null,
    temperatureTop: null,
    temperatureCasing: null,
    voltageIn: null,
    voltageBattery: null,
  }),
  mounted () {
    this.renderLineChart()
  },
  methods: {
    renderLineChart: function() {
      this.labels = this.chartdata.map(d => d.time);
      this.temperatureOutside = this.chartdata.map(d => d.temperature.outside);
      this.temperatureInner = this.chartdata.map(d => d.temperature.inner);
      this.temperatureBottom = this.chartdata.map(d => d.temperature.bottom);
      this.temperatureTop = this.chartdata.map(d => d.temperature.top);
      this.temperatureCasing = this.chartdata.map(d => d.temperature.casing);

      this.voltageIn = this.chartdata.map(d => d.voltage.in);
      this.voltageBattery = this.chartdata.map(d => d.voltage.battery);

      const lineTension = 0.5;
      let borderWidth = 3;
      let pointRadius = 3;
      const pointStyle = "circle";
      const spanGaps = false;

      if(this.labels.length > 500){
        borderWidth = 2;
        pointRadius = 0.1;
      } else if (this.labels.length > 100){
        borderWidth = 3;
        pointRadius = 1;
      }
      this.renderChart({
        labels: this.labels,
        datasets: [{ 
          label: "Teplota venkovní",
          data: this.temperatureOutside,
          borderColor: 'rgb(0, 223, 49)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Teplota vnitřní",
          data: this.temperatureInner,
          borderColor: 'rgb(255, 102, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Teplota dolní",
          data: this.temperatureBottom,
          borderColor: 'rgb(42, 170, 217)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Teplota horní",
          data: this.temperatureTop,
          borderColor: 'rgb(250, 19, 19)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Teplota pláště",
          data: this.temperatureCasing,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgb(252, 236, 3)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Napětí vstupní",
          data: this.voltageIn,
          borderColor: 'rgb(0, 255, 174)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        },{
          label: "Napětí akumulátoru",
          data: this.voltageBattery,
          borderColor: 'rgb(158, 0, 255)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          lineTension,
          borderWidth,
          pointRadius,
          pointStyle,
          spanGaps,
        }]
      },{
        responsive:true,
        hover:{
          intersect:false
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: 'index',
          intersect:false
        },
        legend: {
            display: true,
            labels: {
                fontColor: '#787878',
                padding:10
            }
        },
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          }
        },
        scales: {
          xAxes: [{
              gridLines: {
                  display: true,
              },
              ticks: {
                fontColor: "#787878",
              }
          }],
          yAxes: [{
              display: true,
              gridLines: {
                  display: false,
              },
              ticks: {
                fontColor: "#787878",
              }
          }],
        }
      })
    }
  },
  watch: {
    chartdata: function() {
      this.renderLineChart();
    }
  }
}

</script>