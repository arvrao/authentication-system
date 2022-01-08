const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const hbs = require('hbs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bp = require('body-parser')
const path = require('path')

// app.use(bp.json())

// config files
dotenv.config()

// get the routes
const homeRoute = require('./routers/home')
const userRoute = require('./routers/user')

app.use(express.json())

// * bodyparser extended:true -> req.body object will contain values of any type instead of just strings.
app.use(bp.urlencoded({
  extended: true
}))

// ROUTES
app.use('/', homeRoute)
app.use('/user', userRoute)



// template engine
app.set('view engine', 'hbs')
// set path for views folder inside src
app.set('views', path.join(__dirname, 'views'))

// set path for static files
app.use('/static', express.static('static'))

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