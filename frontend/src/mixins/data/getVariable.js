export default {
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
        }
    }
}