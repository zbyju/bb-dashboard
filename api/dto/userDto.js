const mongoose = require('mongoose')
const async = require('async')
const bcrypt = require('bcrypt')
let User = require('../models/user')

module.exports = {
  create: async function(user) {
    let promise = new Promise(async (resolve, reject) => {

      try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        user.password = hashedPassword
      } catch(err) {
        reject(err)
      }

      User.create(user, (err, user) => {
        if(err) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    })
    return promise
  },
  findOne: async function(query) {
    let promise = new Promise((resolve, reject) => {
      User.findOne(query, "-_id, -__v -password", (err, user) => {
          if(err) {
              reject(err)
          } else {
              resolve(user)
          }
      })
    })
    return promise
  },
  findByUsername: async function(username) {
    let promise = new Promise((resolve, reject) => {
        User.findOne({ username:username }, "-_id, -__v", (err, user) => {
            if(err) {
                reject(err)
            } else {
                resolve(user)
            }
        })
    })
    return promise
  },
}
