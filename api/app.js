const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

let config = require('./config/config')

//Enable cors
app.use(cors())

//Connect to MongoDB
mongoose.connect(`mongodb://${config.database.host}:${config.database.port}/${config.database.name}`, config.database.options, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("Connected to MongoDB")
    }
});


//Routing
let defaultRoute = require('./routes/default')
let babyboxRoute = require('./routes/babybox')
let dataRoute = require('./routes/data')
app.use('/', defaultRoute)
app.use('/api/babybox', babyboxRoute)
app.use('/api/data', dataRoute)


app.listen(config.port, () => console.log(`Server is listening on port ${config.port}!`))