const mongoose = require('mongoose')

let Babybox = require('../models/babybox')

module.exports = {
    create: function(babybox) {
        let promise = new Promise((resolve, reject) => {
            Babybox.create(babybox, (err, babybox) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babybox)
                }
            })
        })
        return promise
    },
    find: function(query) {
        let promise = new Promise((resolve, reject) => {
            Babybox.find(query, (err, babyboxes) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babyboxes)
                }
            })
        })
        return promise
    },
    findById: function(id) {
        let promise = new Promise((resolve, reject) => {
            Babybox.findById(id, (err, babybox) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babybox)
                }
            })
        })
        return promise
    },
    findByIdAndUpdate: function(id, data) {
        let promise = new Promise((resolve, reject) => {
            Babybox.findByIdAndUpdate(id, data, { new: true }, (err, babybox) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babybox)
                }
            })
        })
        return promise
    },
    findByName: function(name) {
        let promise = new Promise((resolve, reject) => {
            Babybox.findOne({name:name}, (err, babybox) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babybox)
                }
            })
        })
        return promise
    },
    findAndPopulate: function() {
        let promise = new Promise((resolve, reject) => {
            Babybox.find({}).populate('lastData').exec((err, babyboxes) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(babyboxes)
                }
            })
        })
        return promise
    }
}