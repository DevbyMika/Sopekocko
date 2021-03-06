const mongoose = require('mongoose')
// validate email syntax
require('mongoose-type-email')
// constraint unique user field
const uniqueValidator = require('mongoose-unique-validator')
// clean enter data before send to database
const sanitizerPlugin = require('mongoose-sanitizer-plugin')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Veuillez rentrer une adress email valide'],
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Veuillez entrer une adresse email correcte']
  },
  password: {
    type: String,
    required: [true, 'Veuillez choisir un mot de passe']
  }
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(sanitizerPlugin)

module.exports = mongoose.model('User', userSchema)
