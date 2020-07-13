const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

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

router.get('/babybox/:id', async (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.id)
    console.log(id)
    let result
    try {
        result = await dataDto.find({ idBabybox: id })
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
 
module.exports = router