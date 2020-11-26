export default {
    methods: {
        isAddressDefined: function() {
            return (
                this.babybox.address &&
                this.babybox.address != {} &&
                (
                    this.babybox.address.hospitalName != "" || 
                    this.babybox.address.city != "" || 
                    this.babybox.address.street != "" || 
                    this.babybox.address.postcode != ""
                )
            )
        },
    }
}