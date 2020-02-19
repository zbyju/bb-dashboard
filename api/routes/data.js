const express = require('express')
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

module.exports = router