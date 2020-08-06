const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session');
 

const app = express()

let config = require('./config/config')

//Enable cors
app.use(cors())

// create application/x-www-form-urlencoded parser
// create application/json parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//Connect to MongoDB
mongoose.connect(`mongodb://${config.database.host}:${config.database.port}/${config.database.name}`, config.database.options, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("Connected to MongoDB")
    }
});
mongoose.set('useCreateIndex', true);

//Routing
let defaultRoute = require('./routes/default')
let defaultApiRoute = require('./routes/defaultApi')
let babyboxRoute = require('./routes/babybox')
let dataRoute = require('./routes/data')
let userRoute = require('./routes/user')
let authRoute = require('./routes/auth')
let notificationRoute = require('./routes/notification')
app.use('/', defaultRoute)
app.use('/api', defaultApiRoute)
app.use('/api/babybox', babyboxRoute)
app.use('/api/user', userRoute)
app.use('/api/data', dataRoute)
app.use('/api/auth', authRoute)
app.use('/api/notification', notificationRoute)


app.listen(config.port, () => console.log(`Server is listening on port ${config.port}!`))