const mongoose = require('mongoose')
const async = require('async')

let Notification = require('../models/notification')
let babyboxDto = require('../dto/babyboxDto')

module.exports = {
  create: async function(notification) {
    let promise = new Promise((resolve, reject) => {
      Notification.create(notification, async (err, createdNotification) => {
          if(err) {
              reject(err)
          } else {
              resolve(createdNotification)
          }
      })
    })
    return promise
  },
  findById: function(id) {
        let promise = new Promise((resolve, reject) => {
            Notification.findById(id, (err, nt) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(nt)
                }
            })
        })
        return promise
    },
}
