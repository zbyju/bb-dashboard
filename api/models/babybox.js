const mongoose = require('mongoose')
let Schema = mongoose.Schema

let babyboxSchema = new Schema({
    //Babybox sends data with this name in the URL
    name: {
        type: String,
        required: true
    },
    //User can rename the babybox to his liking
    customName: {
        type: String
    },
    installDate: {
        type: Date
    },
    lastServisDate: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    address: {
        hospitalName: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        },
        postcode: {
            type: String
        }
    },
    network: {
        //Possible types of network: 0 - not known, 1 - vlan, 2 - routing, 3 - their network, 4 - other
        networkType: {
            type: Number,
            default: 0
        },
        ip: {
            pc: {
                type: String
            },
            pcMask: {
                type: String
            },
            pcGateway: {
                type: String
            },
            routerLAN: {
                type: String
            },
            routerWAN: {
                type: String
            },
            routerGateway: {
                type: String
            },
            SDSTopeni: {
                type: String
            },
            SDSMotory: {
                type: String
            },
            camera: {
                type: String
            }
        },
        components: {
            camera: {
                type: String
            },
            OS: {
                type: String
            },
            PC: {
                type: String
            }
        },
        notes: {
            type: String
        }
    },
    phones: [{
        name: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        note: {
            type: String
        }
    }]
})

babyboxSchema.pre('save', next => {
    this.customName = this.get('name')
    next()
})

let Babybox = module.exports = mongoose.model('Babybox', babyboxSchema)