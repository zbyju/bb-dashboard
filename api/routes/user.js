const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const validateToken = require('../helper/checkAuth').validateToken

let User = require('../models/user')
let userDto = require('../dto/userDto')

router.post("/", validateToken, async (req, res) => {
    let result
    try {
        result = await userDto.create(req.body)
        return res.json(result)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
})

module.exports = router