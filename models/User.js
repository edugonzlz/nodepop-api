"use strict";

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    //TODO: hacer todo required y hacer index por email
    name: String,
    email: String,
    passw: String
});

let User = mongoose.model('User', userSchema);