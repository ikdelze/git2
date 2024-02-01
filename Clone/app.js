require('dotenv').config()
const express = require('express')
const app = express()
const mongo = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const port = 3000

// Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// Engine
app.set('view engine', 'ejs');

const connectToDb = async () => {
    try {
        await mongo.connect(process.env.MONGO_URL)
        console.log('Connected to DB')
    } catch (error) {
        console.log(`Connection error: ${error.message}`)
    }
}

connectToDb()

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

// Routes

app.get('/', (req, res) =>  res.render('home'))
app.get('/smoothies', (req, res) => res.render('smoothies'))
app.use(authRoutes)