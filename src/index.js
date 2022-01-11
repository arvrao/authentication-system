const express = require('express')

const app = express()
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const hbs = require('hbs')
const dotenv = require('dotenv')

// For login
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')

// For getting form contents
const bp = require('body-parser')

// app.use(bp.json())
// used for POST requests; based on body-parser
app.use(express.json())
// config files
dotenv.config()

// * bodyparser extended:true -> req.body object will contain values of any type instead of just strings.
app.use(bp.urlencoded({
  extended: true
}))

//cookie parser middleware to store jwt data
app.use(cookieparser())

// template engine
app.set('view engine', 'hbs')
// set path for views folder inside src
app.set('views', path.join(__dirname, 'views'))

// set path for static files
app.use('/static', express.static('static'))

// get the routes
const homeRoute = require('./routers/home')
const userRoute = require('./routers/user')

// ROUTES
app.use('/', homeRoute)
app.use('/user', userRoute)

app.use('*', (req, res) =>
  res.status(404).send('Incorrect route'));

// DB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connect) => {
    console.log(`Connected to database successfully`)
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(PORT, (req, res) => {
  console.log(`Server up and running on port ${PORT}...`)
})