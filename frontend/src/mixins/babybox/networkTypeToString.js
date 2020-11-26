export default {
    methods: {
        networkTypeToString: function(val) {
            if(val == 0) {
                return "Nevyplněno"
            } else if(val == 1) {
                return "VLAN"
            } else if(val == 2) {
                return "Směrování"
            } else if(val == 3) {
                return "V síti nemocnice"
            }
        },
    }
}