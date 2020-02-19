const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({ msg: 'ok' })
})

//Most important route - reads data from babybox and saves it
router.get('/BB.:name.data', (req, res) => {
})

module.exports = router