const express = require('express')
const router = express.Router()
const loginrequired = require('../config/JWT')
const User = require('../models/userModel')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/dashboard', loginrequired, (req, res) => {
  const userId = req.userId
  User.findOne({
    _id: userId
  }).
  then((user) => {
    res.render('dashboard', {
      user: user.name,
    })
  }).catch(err => {
    console.log(err);
  })

})

module.exports = router