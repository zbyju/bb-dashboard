const mongoose = require('mongoose')

let Schema = mongoose.Schema

let babyboxSchema = new Schema({
    //Babybox sends data with this name in the URL
    name: {
        type: String,
        required: true
    },
    //User can rename the babybox to his liking
    customName: String,
    lastData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data'
    },
    installDate: Date,
    lastServisDate: Date,
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    address: {
        hospitalName: String,
        street: String,
        city: String,
        postcode: String
    },
    network: {
        //Possible types of network: 0 - not known, 1 - vlan, 2 - routing, 3 - their network, 4 - other
        networkType: {
            type: Number,
            default: 0
        },
        ip: {
            pc: String,
            pcMask: String,
            pcGateway: String,
            routerLAN: String,
            routerWAN: String,
            routerGateway: String,
            SDSMotory: String,
            SDSTopeni: String,
            camera: String
        },
        notes: String
    },
    components: {
        camera: String,
        OS: String,
        PC: String
    },
    phones: [{
        name: String,
        phoneNumber: String,
        notes: String
    }],
    notes: String
})

babyboxSchema.pre('save', function(next) {
    this.customName = this.name
    next()
})

let Babybox = module.exports = mongoose.model('Babybox', babyboxSchema)

let Data = require('./data')