const mongoose = require('mongoose')
const async = require('async')

let NotificationTemplate = require('../models/notificationTemplate')
let babyboxDto = require('../dto/babyboxDto')

module.exports = {
  create: async function(notification) {
    let promise = new Promise((resolve, reject) => {
      NotificationTemplate.create(notification, async (err, createdNotification) => {
        if(err) {
          reject(err)
        } else {
          let babyboxes = []
          try {
            if(createdNotification.global) {
              babyboxes = await babyboxDto.find({})
            } else {
                let babybox = await babyboxDto.findById(createdNotification.idBabybox)
                babyboxes.push(babybox)
            }
            babyboxes.forEach(async babybox => {
              console.log(babybox)
              babybox.notificationTemplates.push(createdNotification._id)
              console.log(babybox)
              await babyboxDto.findByIdAndUpdate(babybox._id, babybox)
              resolve(createdNotification)
            })
          } catch(err) {
            console.log(err)
            reject(err)
          }
        }
      })

    })
    return promise
  },
  findById: function(id) {
    let promise = new Promise((resolve, reject) => {
        NotificationTemplate.findById(id, (err, nt) => {
            if(err) {
                reject(err)
            } else {
                resolve(nt)
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
