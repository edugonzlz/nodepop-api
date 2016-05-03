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

userSchema.statics.findUser = function (userName, userMail, userPass, res, callback) {
    
    User.findOne({email:userMail}).exec(function (err, user) {
        if (err){
            return callback(res.status(500).json({success:false, error:err}));
        }
        if (!user){
            return callback(res.status(401).json({success:false, error:'Authetication failed. User name or email is not found'}));
        }
        if (user.passw !== userPass){
            return callback(res.status(401).json({success:false, error:'Authentication failed. The password is not correct'}));
        }
        return callback(null, res, user)
    })
};

let User = mongoose.model('User', userSchema);