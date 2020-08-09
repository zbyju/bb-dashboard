const moment = require('moment')
const mongoose = require('mongoose')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')
let Data = require('../models/data')
let dataDto = require('../dto/dataDto')
let NotificationTemplate = require('../models/notificationTemplate')
const notificationTemplateDto = require('../dto/notificationTemplateDto')
let Notification = require('../models/notification')
const notificationDto = require('../dto/notificationDto')


module.exports = {
    mapDataToIndex(data, index) {
        if(index == 0) {
            return data.temperature.outside
        } else if(index == 1) {
            return data.temperature.inner
        } else if(index == 2) {
            return data.temperature.bottom
        } else if(index == 3) {
            return data.temperature.top
        } else if(index == 4) {
            return data.temperature.casing
        } else if(index == 5) {
            return data.temperature.in
        } else if(index == 6) {
            return data.temperature.battery
        }
        return null
    },
    fixValuesFromBabybox: function(data) {
        data.temperature.outside = (data.temperature.outside.trim() / 100).toFixed(2)
        data.temperature.inner = (data.temperature.inner.trim() / 100).toFixed(2)
        data.temperature.bottom = (data.temperature.bottom.trim() / 100).toFixed(2)
        data.temperature.top = (data.temperature.top.trim() / 100).toFixed(2)
        data.temperature.casing = (data.temperature.casing.trim() / 100).toFixed(2)

        data.voltage.in = (data.voltage.in.trim() / 100).toFixed(2)
        data.voltage.battery = (data.voltage.battery.trim() / 100).toFixed(2)

        const minute = moment(data.time).minute()
        const lastDigitMinute = minute.toString()[1]
        if(lastDigitMinute != 9 && lastDigitMinute != 0 && lastDigitMinute != 1) {
            data.status = 2 //Data came, but not at the rigth time (x9, x0, x1)
        }

        for(let i = 0; i < 7; ++i) {
            if(Math.abs(this.mapDataToIndex[i] < 0.1)) {
                data.status = 3 //Thermometer not working
            }
        }

        return data
    },
    getVariable(data, variable) {
        if(variable == 0) {
            return data.status
        } else if(variable == 1) {
            return data.temperature.inner
        } else if(variable == 2) {
            return data.temperature.outside
        } else if(variable == 3) {
            return data.temperature.bottom
        } else if(variable == 4) {
            return data.temperature.top
        } else if(variable == 5) {
            return data.temperature.casing
        } else if(variable == 6) {
            return data.voltage.in
        } else if(variable == 7) {
            return data.voltage.battery
        }
    },
    compareValues(data, comparison, threshold) {
        if(comparison == '<') {
            return data < threshold
        } else if(comparison == '>') {
            return data > threshold
        } else if(comparison == '<=') {
            return data <= threshold
        } else if(comparison == '>=') {
            return data >= threshold
        } else if(comparison == '==') {
            return data == threshold
        } else if(comparison == '!=') {
            return data != threshold
        }
        return false
    },
    checkForNotification(data, nt) {
        let dataVariable = this.getVariable(data, nt.variable)
        if(this.compareValues(dataVariable, nt.comparison, nt.threshold)) {
            return true
        }
        return false
    },
    calculateStreak: async function(babybox, dato, nt)  {
        return new Promise(async (resolve, reject) => {
            let streak = 0
            try {
                let data = await dataDto.find(
                    { idBabybox: babybox._id },
                    { "time": "-1"},
                    nt.streak + 1
                )
                data.forEach(x => {
                    if(dato._id.toString() != x._id.toString()) {
                        if(!this.checkForNotification(x, nt)) {
                            resolve(streak)
                        } else {
                            ++streak;
                        }
                    }
                })
                resolve(streak)
            } catch(err) {
                console.log(err)
                reject(-1)
            }
        })
    },
    checkForNotifications: function(babybox, data) {
        console.log("-----------------")
        babybox.notificationTemplates.forEach(async ntid => {
            try {
                let nt = await notificationTemplateDto.findById(ntid)
                console.log("Checking ", nt.title)
                if(this.checkForNotification(data, nt)) {
                    console.log("Checked ok", nt.title)
                    let streak = await this.calculateStreak(babybox, data, nt)
                    if(streak >= nt.streak || nt.streak == 0) {
                        console.log("streak ok", nt.title)
                        let notification = new Notification()
                        notification.notificationTemplate = ntid
                        notification.babybox = babybox._id
                        notification.data = data._id
                        notification = await notificationDto.create(notification)
                    } else {
                        console.log("streak neok", nt.title)
                    }
                } else {
                    console.log("Checked neok", nt.title)
                }
            } catch(err) {
                console.log(err)
            }
        })
    }
}