const mongoose = require('mongoose')
const async = require('async')

let Notification = require('../models/notification')
let babyboxDto = require('../dto/babyboxDto')
const notification = require('../models/notification')

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
          let res = notification.notificationTemplate &&
          notification.notificationTemplate != null && 
          'title' in notification.notificationTemplate && 
          notification.babybox && 
          notification.data
          return res
        })
        notifications.sort((a, b) => {
          console.log(a)
          if(a.notificationTemplate.title == b.notificationTemplate.title){
            return (a.data.time < b.data.time) ? -1 : (a.data.time > b.data.time) ? 1 : 0;
          } else {
            return (a.notificationTemplate.title < b.notificationTemplate.title) ? -1 : 1;
          }
        })
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
  deleteById: function(id) {
    let promise = new Promise((resolve, reject) => {
      Notification.deleteById(id, (err, nt) => {
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
