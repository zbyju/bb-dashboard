const mongoose = require('mongoose')

let Schema = mongoose.Schema

let notificationTemplateSchema = new Schema({
    global: Boolean,
    title: String,
    message: String,
    emailNotification: {
        type: Boolean,
        default: true
    },
    emails: [{
        type: String,
    }],
    variable: Number,
    comparison: String,
    threshold: Number,
    streak: Number,
    priority: Number
})

let NotificationTemplate = module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema)