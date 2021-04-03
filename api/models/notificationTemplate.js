const mongoose = require('mongoose')
const notificationDto = require('../dto/notificationDto')
const babyboxDto = require('../dto/babyboxDto')

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

notificationTemplateSchema.post('findOneAndDelete', async function(deletedNotification) {
    //Delete notification from all babyboxes
    let babyboxes = []
    if(deletedNotification.global) {
        babyboxes = await babyboxDto.find({})
    } else {
        let babybox = await babyboxDto.findById(deletedNotification.idBabybox)
        babyboxes.push(babybox)
    }
    babyboxes.forEach(async babybox => {
        let index = babybox.notificationTemplates.indexOf(deletedNotification._id)
        if(index != -1) {
            babybox.notificationTemplates.splice(index, 1)
        }
        await babyboxDto.findByIdAndUpdate(babybox._id, babybox)
    })

    //Delete all notifications with this template
    let childNotifications = await notificationDto.findByTemplateId(deletedNotification._id)
    childNotifications.forEach(notif => {
        notificationDto.deleteById(notif._id)
    })
})

let NotificationTemplate = module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema)
