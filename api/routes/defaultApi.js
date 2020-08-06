const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/check', (req, res) => {
    let connection = {
        server: {
            status: 1,
            message: "OK",
            loaded: true
        },
        database: {
            status: mongoose.connection.readyState,
            message: "",
            loaded: true
        }
    }
    if(mongoose.connection.readyState == 0) {
        connection.database.message = "Odpojeno"
    } else if(mongoose.connection.readyState == 1) {
        connection.database.message = "OK"
    } else if(mongoose.connection.readyState == 2) {
        connection.database.message = "Připojování"
    } else if(mongoose.connection.readyState == 3) {
        connection.database.message = "Odpojování"
    } else {
        connection.database.message = "Chyba"
    }
    return res.json(connection)
})

module.exports = router