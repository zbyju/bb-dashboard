const mongoose = require('mongoose')

let Schema = mongoose.Schema

let notificationSchema = new Schema({
    idNotification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotificationTemplate',
        required: true
    },
    idData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data',
        required: true
    }
})

let Notification = module.exports = mongoose.model('Notification', notificationSchema)