const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const moment = require('moment')
const validateToken = require('../helper/checkAuth').validateToken

const notificationTemplateDto = require('../dto/notificationTemplateDto')
const notificationDto = require('../dto/notificationDto')
const babyboxDto = require('../dto/babyboxDto')

router.get('/template/global', validateToken, async (req, res) => {
    let result
    try {
        result = await notificationTemplateDto.findGlobal()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.post('/template/global', validateToken, async (req, res) => {
    let result
    try {
        result = await notificationTemplateDto.create(req.body)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.get('/babybox/:id', validateToken, async (req, res) => {
    let result
    try {
        result = await notificationDto.find({ 
                babybox: mongoose.Types.ObjectId(req.params.id) 
            })
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
 
module.exports = router