const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
// const popup = require('popups')

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register')
})

// sign up new users
router.post('/register', (req, res) => {
	// handling validation in form
	const errors = []
	const {
		name,
		email,
		password,
		password2
	} = req.body
	// console.log(name, email, password);

	if (!name || !email || !password || !password2) {
		errors.push({
			msg: 'Please enter all details!'
		})

		console.log('All fields are required')
	}

	//  email validation
	// const validRegex =
	//   /^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}] + @[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/


	// if (!email.match(validRegex)) {
	//   errors.push({
	//     msg: 'Invalid email'
	//   })
	//   console.log('Invalid email')
	// }

	// Validate password length
	if (password.length < 6) {
		errors.push({
			msg: 'Password length must be at least 6 characters'
		})
		console.log('Password length must be at least 6 characters')
	}

	// password match validation
	if (password !== password2) {
		errors.push({
			msg: 'Passwords must match'
		})
		console.log('Passwords must match')
	}

	if (errors.length > 0) {
		// Errors on page, reloads it again
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2,
		})
	}
	// checks if user exists
	else {
		User.findOne({
			email: email
		}).then((user) => {
			if (user) {
				errors.push({
					msg: 'User has already registered'
				})
				console.log('User has already registered! Try out a different email')
				res.render('register')
			} else {
				// All validations are passed, create new user & save to DB
				const user = new User({
					name,
					email,
					password,
				})
				// hash the password

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(user.password, salt, (err, salt) => {
						user.password = salt;
						user.save().then((user) => {
							console.log('User has been created');
							res.status(201).redirect('/user/login')
						}).catch((err) => {
							console.log(err);
							res.redirect('user/register')
						})



					})
				})

			}
		}).catch((err) => {
			res.render('register')
		})
	}
})

// sing the token
const createToken = (id) => {
	return jwt.sign({
		id
	}, 'secretkey')
}


router.post('/login', (req, res) => {
	const {
		email,
		password
	} = req.body;
	User.findOne({
			email: email
		})
		.then((user) => {
			if (user) {

				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (isMatch) {
						// generate new random token
						const token = createToken(user._id)

						// store jwt in a cookie
						res.cookie('access-token', token)
						res.redirect('/dashboard')
					} else {
						res.render('login')
						console.log('Wrong credentials!');
					}
				})
			} else {
				console.log('Couldn\'t find the user');
				res.render('login')
			}
		})
})

router.get('/logout', (req, res) => {
	res.cookie('access-token', ' ', {
		maxAge: 1
	})
	res.redirect('/user/login')
})

module.exports = router