const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
const sauceValidator = require('../middleware/sauceValidator');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true},
  manufacturer: { type: String, required: true },
  description: { type: String, required: true},
  mainPepper: { type: String, required: true},
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  disLikes: { type: Number },
  usersLiked: {type:[ String ]},
  usersDisliked: {type:[ String ]},
});

sauceSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('Sauce', sauceSchema);