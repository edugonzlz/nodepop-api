"use strict";

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    //TODO: hacer todo required y hacer index por email
    name: String,
    email: String,
    passw: String
});

userSchema.statics.saveUser = function (userName, userMail, userPass, callback) {

    let user = new User({name:userName, email:userMail, passw:userPass});

    user.save(function (err, saved) {
        if (err){
            return callback(err);
        }
        return callback(err,saved);
    })
};

userSchema.statics.findUser = function (userName, userMail, userPass, res, callback) {
    
    User.findOne({email:userMail}).exec(function (err, user) {
        if (err){
            return callback(res.status(500).json({success:false, error:err}));
        }
        return callback(null, user)
    })
};

let User = mongoose.model('User', userSchema);