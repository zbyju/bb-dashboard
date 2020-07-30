const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const moment = require('moment')

const notificationTemplateDto = require('../dto/notificationTemplateDto')
const notificationDto = require('../dto/notificationDto')
const babyboxDto = require('../dto/babyboxDto')

router.get('/template/global', async (req, res) => {
    console.log("test")
    let result
    try {
        result = await notificationTemplateDto.findGlobal()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.post('/template/global', async (req, res) => {
    let babyboxes
    try {
        babyboxes = await babyboxDto.find()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    babyboxes.forEach(babybox => {
        req.body.idBabyboxes.push(babybox._id)
    })

    console.log(req.body)
    let result
    try {
        result = await notificationTemplateDto.create(req.body)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    console.log(result)
    return res.json(result)
})
 
module.exports = router