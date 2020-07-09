const express = require('express')
const router = express.Router()

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')

router.get('/all', async (req, res) => {
    let result
    try {
        result = await babyboxDto.find()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/all/populate', async (req, res) => {
    let result
    try {
        result = await babyboxDto.findAndPopulate()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/:id', async (req, res) => {
    let result
    try {
        result = await babyboxDto.findById(req.params.id)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.get('/name/:name', async (req, res) => {
    console.log(req.params.name)
    let result
    try {
        result = await babyboxDto.findByName(req.params.name)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

module.exports = router