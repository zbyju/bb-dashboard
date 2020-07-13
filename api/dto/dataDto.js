const mongoose = require('mongoose')
const async = require('async')
let Data = require('../models/data')
let babyboxDto = require('./babyboxDto')

module.exports = {
    create: function(data) {
        let promise = new Promise((resolve, reject) => {
            Data.create(data, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    },
    find: function(query) {
        console.log(query)
        let promise = new Promise((resolve, reject) => {
            Data.find(query, (err, datas) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(datas)
                }
            })
        })
        return promise
    },
    findById: function(id) {
        let promise = new Promise((resolve, reject) => {
            Data.findById(id, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
        return promise
    },
    findByName: function(name) {
        let promise = new Promise((resolve, reject) => {
            Data.find({name:name}, (err, datas) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(datas)
                }
            })
        })
        return promise
    }
}
