const express = require('express')
const mongoose = require('mongoose')
// Add 9 middelware add heading http securitys
const helmet = require('helmet')
// secure path
const path = require('path')
// secure user cooki session
const cookieSession = require('cookie-session')
// environnement variable to secure serveur path
const dotenv = require('dotenv')

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

dotenv.config()

mongoose.connect(process.env.MONGO_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(helmet())

const expiryDate = new Date(Date.now() + 3600000)
app.use(cookieSession({
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}))

// update body parser reading, read and convert the serveur request
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
