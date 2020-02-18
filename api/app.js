const express = require('express')
const app = express()

let config = require('./config/config')

//Routing
let defaultRoute = require('./routes/default')
let apiRoute = require('./routes/api')
app.use('/', defaultRoute)
app.use('/api', apiRoute)


app.listen(config.port, () => console.log(`Server is listening on port ${config.port}!`))