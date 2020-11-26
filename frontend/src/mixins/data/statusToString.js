export default {
    methods: {
        statusToString: function(status) {
            if (status == 0) {
            return "OK";
            } else if (status == 1) {
            return "Chyba";
            } else if (status == 2) {
            return "Varování - čas";
            } else if (status == 3) {
            return "Varování - data";
            } else if (status == 4) {
            return "Varování - server";
            } else {
            return "???"
            }
        }
    }
}