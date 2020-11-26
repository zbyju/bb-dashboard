export default {
    methods: {
        isNetworkDefined: function() {
            return (
                this.babybox.network &&
                this.babybox.network.ip &&
                this.babybox.network.ip != {} &&
                this.babybox.networkType >= 0
            )
        }
    }
}