const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const _ = require('lodash')
const moment = require('moment')
const cron = require('node-cron')

const helper = require('../helper/utility')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')
let Data = require('../models/data')
let dataDto = require('../dto/dataDto')

cron.schedule('2,12,22,32,42,52 * * * *', async () => {
  try {
    let babyboxes = await babyboxDto.findAndPopulate()
    babyboxes.forEach(async babybox => {
      let now = moment()
      let babyboxTime = moment(babybox.lastData.time)
      let diff = moment.duration(now.diff(babyboxTime)).asMinutes().toFixed(0)
      if(diff >= 5) {
        let data = Data()
        data.idBabybox = babybox._id
        data.temperature = {}
        data.voltage = {}
        data.status = 1
        data.time = moment().add('-2', 'minutes')
        await dataDto.create(data, babybox)
      }
    })
  } catch(err) {
    console.log(err)
  }
})
cron.schedule('0 0 21 * * *', async () => {
    try {
        let babyboxes = await babyboxDto.find()
        babyboxes.forEach(async babybox => {
            let data = await dataDto.find({ idBabybox : babybox._id }, { 'time': '1' }, 100) //index 0 is the oldest
            let current = 0
            let next = 1
            while(next < data.length) {
                let currentTime = moment(data[current].time)
                let nextTime = moment(data[next].time)
                let diff = Math.abs(moment.duration(currentTime.diff(nextTime)).asMinutes().toFixed(0))
                console.log(diff)
                while(diff >= 12) {
                    let data = Data()
                    data.idBabybox = babybox._id
                    data.temperature = {}
                    data.voltage = {}
                    data.status = 4
                    data.time = currentTime.add('10', 'minutes')
                    await dataDto.create(data, babybox)
                    
                    currentTime = moment(data.time)
                    diff = Math.abs(moment.duration(currentTime.diff(nextTime)).asMinutes().toFixed(0))
                }
                ++current
                ++next
            }
        })
    } catch(err) {
        console.log(err)
    }
})

//Most important route - reads data from babybox and saves it
router.get('/BB.:name.data', async (req, res) => {
    let result;
    let babybox = new Babybox()
    if(!req.params.name || req.params.name == "") {
        return res.status(500).send()
    }
    babybox.name = req.params.name

    try {
        result = await babyboxDto.findByName(req.params.name)
        //If the babybox doesnt exist yet, it gets created
        if(result == null) {
            try {
                //Creates babybox with all the alerts and assigns global notifications
                result = await babyboxDto.create(babybox)
            } catch(err) {
                console.log(err)
                return res.status(500).send()
            }
        }
        babybox = result
        //Everything is now ready to save the data
        let data = {
            _id: mongoose.Types.ObjectId(),
            idBabybox: result.id,
            status: req.query.T6 || req.query.t6,
            temperature: {
                outside: req.query.T0 || req.query.t0,
                inner: req.query.T1 || req.query.t1,
                bottom: req.query.T2 || req.query.t2,
                top: req.query.T3 || req.query.t3,
                casing: req.query.T7 || req.query.t7
            },
            voltage: {
                in: req.query.T4 || req.query.t4,
                battery: req.query.T5 || req.query.t5
            },
            time: moment().toDate()
        }
        data = helper.fixValuesFromBabybox(data)
        
        try {
            result = await dataDto.create(data, babybox)
            return res.json({ msg: "ok" })
        } catch(err) {
            console.log(err)
            return res.status(500).send()
        }
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
})

module.exports = router