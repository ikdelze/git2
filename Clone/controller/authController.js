const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleError = (err) => {
    let errors = {email: '', password: ''}

    if (err.code === 11000) {
        errors.email = 'This email is registered!'
        return errors
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// A function that creates a token
maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}

// @POST ROUTES

module.exports.signup_post = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.create({
            email,
            password
        })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
        
    } catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors })
    }
}
module.exports.login_post = (req, res) => {
    res.send('login')
}