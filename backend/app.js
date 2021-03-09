const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const helmet = require('helmet')
const path = require('path')
const nocache = require('nocache')
const cookieSession = require('cookie-session')
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
app.use(nocache())

const expiryDate = new Date(Date.now() + 3600000)
app.use(cookieSession({
  name: 'session',
  secret: 'RANDOM_SECRET_KEY',
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}))

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
