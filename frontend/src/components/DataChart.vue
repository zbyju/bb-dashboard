<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Array,
      default: null
    }
  },
  mounted () {
    const labels = this.chartdata.map(d => d.time);
    const temperatureOutside = this.chartdata.map(d => d.temperature.outside);
    const temperatureInner = this.chartdata.map(d => d.temperature.inner);
    const temperatureBottom = this.chartdata.map(d => d.temperature.bottom);
    const temperatureTop = this.chartdata.map(d => d.temperature.top);
    const temperatureCasing = this.chartdata.map(d => d.temperature.casing);

    const voltageIn = this.chartdata.map(d => d.voltage.in);
    const voltageBattery = this.chartdata.map(d => d.voltage.battery);

    const lineTension = 0.5;
    let borderWidth = 3;
    let pointRadius = 3;
    const pointStyle = "circle";
    const spanGaps = false;

    if(labels.length > 500){
      borderWidth = 2;
      pointRadius = 0.1;
    } else if (labels.length > 100){
      borderWidth = 3;
      pointRadius = 1;
    }


    this.renderChart({
      labels,
      datasets: [{ 
        label: "Teplota venkovní",
        data: temperatureOutside,
        borderColor: 'rgb(0, 223, 49)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Teplota vnitřní",
        data: temperatureInner,
        borderColor: 'rgb(255, 102, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Teplota dolní",
        data: temperatureBottom,
        borderColor: 'rgb(42, 170, 217)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Teplota horní",
        data: temperatureTop,
        borderColor: 'rgb(250, 19, 19)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Teplota pláště",
        data: temperatureCasing,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(252, 236, 3)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Napětí vstupní",
        data: voltageIn,
        borderColor: 'rgb(158, 0, 255)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        lineTension,
        borderWidth,
        pointRadius,
        pointStyle,
        spanGaps,
      },{
        label: "Napětí akumulátoru",
        data: voltageBattery,
        borderColor: 'rgb(255, 255, 255)',
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
              fontColor: '#fff',
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
              fontColor: "#fff",
            }
        }],
        yAxes: [{
            display: true,
            gridLines: {
                display: false,
            },
            ticks: {
              fontColor: "#fff",
            }
        }],
      }
    })
  }
}

</script>