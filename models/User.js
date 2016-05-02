"use strict";

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    //TODO: hacer todo required y hacer index por email
    name: String,
    email: String,
    passw: String
});

userSchema.statics.saveUser = function (newUser, callback) {

    let user = new User(newUser);

    user.save(function (err, saved) {
        if (err){
            next(err);
            return;
        }
        return callback(err,saved);
    })
};
let User = mongoose.model('User', userSchema);