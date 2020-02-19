const mongoose = require('mongoose')

let Data = require('../models/data')

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
    find: function() {
        let promise = new Promise((resolve, reject) => {
            Data.find({}, (err, data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(data)
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