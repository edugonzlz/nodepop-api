"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    //TODO: hacer todo required y hacer index por email
    name: String,
    email: String,
    passw: String
});

var User = mongoose.model('User', userSchema);