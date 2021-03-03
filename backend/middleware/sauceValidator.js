var mongoose = require('mongoose')
var validate = require('mongoose-validator')
 
exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 60],
    message: 'Le nom de votre sauce doit contenir entre 3 et 60 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /[^\p{L}\d\s@#]/u,
    message: 'Vous ne pouvez saisir que des chiffres et des lettres',
  }),
]
exports.manufacturerValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 60],
    message: 'Le nom de votre sauce doit contenir entre 3 et 60 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /[^\p{L}\d\s@#]/u,
    message: 'Vous ne pouvez saisir que des chiffres et des lettres',
  }),
]
exports.descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [10, 150],
    message: 'Le nom de votre sauce doit contenir entre 3 et 60 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /[^\p{L}\d\s@#]/u,
    message: 'Vous ne pouvez saisir que des chiffres et des lettres',
  }),
]
exports.mainPepperValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Le nom de votre sauce doit contenir entre 3 et 60 caractères',
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Ne peut contenir que des caractères alphanumériques entre 3 et 20 caractères',
  }),
]
