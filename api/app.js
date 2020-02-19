const express = require('express')
const mongoose = require('mongoose')

const app = express()

let config = require('./config/config')

//Connect to MongoDB
mongoose.connect(config.database.url, config.database.options)
let db = mongoose.connection
db.once('open', () => {
    console.log('Connected to MongoDB')
})
db.on('error', err => {
    console.log(err)
})

//Routing
let defaultRoute = require('./routes/default')
let apiRoute = require('./routes/api')
app.use('/', defaultRoute)
app.use('/api', apiRoute)


app.listen(config.port, () => console.log(`Server is listening on port ${config.port}!`))