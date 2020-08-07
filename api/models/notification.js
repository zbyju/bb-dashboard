const mongoose = require('mongoose')

let Schema = mongoose.Schema

let notificationSchema = new Schema({
    notificationTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotificationTemplate',
        required: true
    },
    babybox: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Babybox',
        required: true
    },
    data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data',
        required: true
    }
},{ timestamps: true })

let Notification = module.exports = mongoose.model('Notification', notificationSchema)