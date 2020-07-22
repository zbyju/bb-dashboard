const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const moment = require('moment')

let Data = require('../models/data')
let dataDto = require('../dto/dataDto')

router.get('/all', async (req, res) => {
    let result
    try {
        result = await dataDto.find()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/:id', async (req, res) => {
    let result
    try {
        result = await dataDto.findById(req.params.id)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

//Request all data of babybox with filters(req.body)
router.post('/babybox/:id', async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    let limit = Number.MAX_SAFE_INTEGER;
    let from, to;
    let query = {
        idBabybox: id,
    }
    if(req.body.from) {
        from = moment(req.body.from, "YYYY-MM-DD")
    } else {
        from = moment().add(-7, 'days')
    }
    if(req.body.from) {
        to = moment(req.body.to, "YYYY-MM-DD")
    } else {
        to = moment()
    }
    query["time"] = {
        "$gte": from.startOf('day').toDate(),
        "$lt": to.endOf('day').toDate()
    }
    if(req.body.count) {
        limit = req.body.count
    }
    let result
    try {
        result = await dataDto.find(query, limit)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
 
module.exports = router