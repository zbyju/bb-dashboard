const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const _ = require('lodash')

const helper = require('../helper/utility')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')
let Data = require('../models/data')
let dataDto = require('../dto/dataDto')

router.get('/', (req, res) => {
    res.json({ msg: 'ok' })
})

router.get('/check', (req, res) => {
    let connection = {
        server: {
            status: 1,
            message: "OK",
            loaded: true
        },
        database: {
            status: mongoose.connection.readyState,
            message: "",
            loaded: true
        }
    }
    if(mongoose.connection.readyState == 0) {
        connection.database.message = "Odpojeno"
    } else if(mongoose.connection.readyState == 1) {
        connection.database.message = "OK"
    } else if(mongoose.connection.readyState == 2) {
        connection.database.message = "Připojování"
    } else if(mongoose.connection.readyState == 3) {
        connection.database.message = "Odpojování"
    } else {
        connection.database.message = "Chyba"
    }
    return res.json(connection)
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
        //Everything is now ready to save the data
        let data = {
            idBabybox: result.id,
            status: req.query.T6,
            temperature: {
                outside: req.query.T0,
                inner: req.query.T1,
                bottom: req.query.T2,
                top: req.query.T3,
                casing: req.query.T7
            },
            voltage: {
                in: req.query.T4,
                battery: req.query.T5
            }
        }
        data = helper.fixValuesFromBabybox(data)

        //Checks for global and local notifications and creates them if condition is true
        helper.checkForNotifications(data)
        
        try {
            result = await dataDto.create(data)
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