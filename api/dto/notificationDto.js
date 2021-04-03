const mongoose = require('mongoose')

let Notification = require('../models/notification')
let babyboxDto = require('../dto/babyboxDto')

function notificationSort(a, b) {
  if(a.notificationTemplate.title == b.notificationTemplate.title){
    return (a.data.time < b.data.time) ? -1 : (a.data.time > b.data.time) ? 1 : 0;
  } else {
    return (a.notificationTemplate.title < b.notificationTemplate.title) ? -1 : 1;
  }
}

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
  find: function(query) {
    let promise = new Promise((resolve, reject) => {
      Notification.find(query).populate('notificationTemplate babybox data').exec((err, notifications) => {
        notifications = notifications.filter(notification => {
          return (
          notification.notificationTemplate             &&
          notification.notificationTemplate != null     &&
          'title' in notification.notificationTemplate  &&
          notification.babybox                          &&
          notification.data )
        })

        notifications.sort(notificationSort)

        if(err) {
          reject(err)
        } else {
          resolve(notifications)
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
  findByTemplateId: function(id) {
    let promise = new Promise((resolve, reject) => {
      Notification.find({notificationTemplate: mongoose.Types.ObjectId(id)}).exec((err, notifications) => {
        if(err) {
          reject(err)
        } else {
          resolve(notifications)
        }
      })
    })
    return promise
  },
  deleteById: function(id) {
    let promise = new Promise((resolve, reject) => {
      Notification.findByIdAndDelete(id, (err, nt) => {
        if(err) {
          reject(err)
        } else {
          resolve(nt)
        }
      })
    })
    return promise
  }
}
