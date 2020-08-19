const moment = require('moment')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')
let Data = require('../models/data')
let dataDto = require('../dto/dataDto')
let NotificationTemplate = require('../models/notificationTemplate')
let notificationTemplateDto = require('../dto/notificationTemplateDto')
let Notification = require('../models/notification')
let notificationDto = require('../dto/notificationDto')

let config = require('../config/config')
module.exports = {
    sendEmail: async function(babybox, data, nt) {
        let transporter = nodemailer.createTransport({
            host: config.email.smtp,
            port: config.email.port,
            secure: true, // true for 465, false for other ports
            auth: {
              user: config.email.user, // generated ethereal user
              pass: config.email.password, // generated ethereal password
            },
        });
        let statusMessage = "???"
        if(data.status == 0) {
            statusMessage = "OK"
        } else if(data.status == 1) {
            statusMessage = "Chyba"
        } else if(data.status == 3) {
            statusMessage = "Varování - data"
        } else if(data.status == 2) {
            statusMessage = "Varování - čas"
        }

        let info = await transporter.sendMail({
            from: `"Babybox Dashboard" <${ config.email.user }>`, // sender address
            to: nt.emails, // list of receivers
            subject: `Babybox ${ babybox.customName } ${ nt.title }`, // Subject line
            text: nt.message, // plain text body
            html: `
                <h1>Babybox ${ babybox.customName }</h1>
                <h2>${ nt.title }</h2>
                <p>${ nt.message }</p>
                <br>
                <hr>
                <br>
                <h2>Data:</h2>
                <ul>
                    <li>Teplota vnitřní: ${ data.temperature.inner || "--" }°C</li>
                    <li>Teplota venkovní: ${ data.temperature.outside || "--" }°C</li>
                    <li>Teplota dolní: ${ data.temperature.bottom || "--" }°C</li>
                    <li>Teplota horní: ${ data.temperature.top || "--" }°C</li>
                    <li>Teplota pláště: ${ data.temperature.casing || "--" }°C</li>
                    <li>Napětí vstupní: ${ data.voltage.in || "--" }V</li>
                    <li>Napětí akumulátoru: ${ data.voltage.battery || "--" }V</li>
                    <li>Status: ${ statusMessage }</li>
                </ul>
            `
        });
    },
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
        if(!data.temperature || !data.voltage || !data.status) {
            data.status = 1
        }
        try {
            data.temperature.outside = data.temperature.outside.trim()
            data.temperature.inner = data.temperature.inner.trim()
            data.temperature.bottom = data.temperature.bottom.trim()
            data.temperature.top = data.temperature.top.trim()
            data.temperature.casing = data.temperature.casing.trim()
            data.voltage.in = data.voltage.in.trim()
            data.voltage.battery = data.voltage.battery.trim()
        
            data.temperature.outside = (data.temperature.outside / 100).toFixed(2)
            data.temperature.inner = (data.temperature.inner / 100).toFixed(2)
            data.temperature.bottom = (data.temperature.bottom / 100).toFixed(2)
            data.temperature.top = (data.temperature.top / 100).toFixed(2)
            data.temperature.casing = (data.temperature.casing / 100).toFixed(2)

            data.voltage.in = (data.voltage.in / 100).toFixed(2)
            data.voltage.battery = (data.voltage.battery / 100).toFixed(2)

            const minute = moment(data.time).minute()
            let lastDigitMinute
            if(minute.toString().length > 1) {
                lastDigitMinute = minute.toString()[1]
            } else {
                lastDigitMinute = minute.toString()[0]
            }
            if(lastDigitMinute != 9 && lastDigitMinute != 0 && lastDigitMinute != 1) {
                data.status = 2 //Data came, but not at the rigth time (x9, x0, x1)
            }

            for(let i = 0; i < 7; ++i) {
                if(Math.abs(this.mapDataToIndex[i] < 0.1)) {
                    data.status = 3 //Thermometer not working
                }
            }
        } finally {
            return data
        }

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
        if(!babybox.notificationTemplates || babybox.notificationTemplates.length == 0) {
            return
        }
        babybox.notificationTemplates.forEach(async ntid => {
            try {
                let nt = await notificationTemplateDto.findById(ntid)
                if(this.checkForNotification(data, nt)) {
                    let streak = await this.calculateStreak(babybox, data, nt)
                    if(streak >= nt.streak || nt.streak == 0) {
                        let notification = new Notification()
                        notification.notificationTemplate = ntid
                        notification.babybox = babybox._id
                        notification.data = data._id
                        notification = await notificationDto.create(notification)

                        if(nt.emailNotification == true && nt.emails.length > 0) {
                            this.sendEmail(babybox, data, nt)
                        }
                    }
                }
            } catch(err) {
                console.log(err)
            }
        })
    },
}