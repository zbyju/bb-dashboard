export default {
    methods: {
        variableToString: function(index) {
            if(index == 0) {
              return "Status"
            } else if(index == 1) {
              return "Teplota vnitřní"
            } else if(index == 2) {
              return "Teplota venkovní"
            } else if(index == 3) {
              return "Teplota dolní"
            } else if(index == 4) {
              return "Teplota horní"
            } else if(index == 5) {
              return "Teplota plášť"
            } else if(index == 6) {
              return "Napětí vstupní"
            } else if(index == 7) {
              return "Napětí akumulátor"
            }
        }
    }
}