const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({ msg: 'ok' })
})

module.exports = router