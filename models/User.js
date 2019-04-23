'use strict';

const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date
});

const userSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  log: [exerciseSchema]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);