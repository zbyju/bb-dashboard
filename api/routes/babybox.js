const express = require('express')
const router = express.Router()
const validateToken = require('../helper/checkAuth').validateToken

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')

router.get('/all', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.find()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/all/populate', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.findAndPopulate()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/:id', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.findById(req.params.id)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.put('/:id', validateToken, async (req, res) => {
    console.log(req.body)
    let result
    try {
        result = await babyboxDto.findByIdAndUpdate(req.params.id, req.body)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.get('/name/:name', validateToken, async (req, res) => {
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