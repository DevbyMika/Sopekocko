const mongoose = require("mongoose");
require('mongoose-type-email');

const uniqueValidator = require("mongoose-unique-validator");
const sanitizerPlugin = require('express-mongo-sanitize');


const userSchema = mongoose.Schema({
    email: { type: String, required:true, unique : true},
    password: { type: String, required:true},
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model("User", userSchema);