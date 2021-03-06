const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
 
const app = express()
let config = require('./config/config')

//Set path to root folder
global.appRoot = path.resolve(__dirname);

if(process.env.NODE_ENV !== 'production') {
    console.log("Server is running in development!")
        
    app.set('trust proxy', 'loopback,uniquelocal');
    app.set('trust proxy', function(){ return true; });
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :remote-addr'))
}

//Enable cors
app.use(cors())

// create application/x-www-form-urlencoded parser
// create application/json parser
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json());

//expose uploads to public
app.use('/api/uploads', express.static(__dirname + '/uploads/'))

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

if(process.env.NODE_ENV === 'production') {
    console.log("Server is running in production!")

    app.use(express.static(__dirname + '/public/'))

    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    })
}

app.listen(config.port, () => console.log(`Server is listening on port ${config.port}!`))