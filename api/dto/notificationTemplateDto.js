const mongoose = require('mongoose')
const async = require('async')
let NotificationTemplate = require('../models/notificationTemplate')

module.exports = {
    create: function(notification) {
        let promise = new Promise((resolve, reject) => {
            NotificationTemplate.create(notification, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(notification)
                }
            })
        })
        return promise
    },
    findGlobal: function() {
        let promise = new Promise((resolve, reject) => {
            NotificationTemplate.find({ global: true }, (err, notifications) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(notifications)
                }
            })
        })
        return promise
    },
}
