"use strict";

let mongoose = require('mongoose');
let hash = require('hash.js');
let errorManager = require('../lib/errorManager');

let userSchema = mongoose.Schema({
    //TODO: hacer todo required y hacer index por email
    name: {type: String, required: true},
    email: {type: String, index: true, required: true},
    passw: {type: String, required: true}
});

// userSchema.index({ email: 1, type: -1 });
// userSchema.index({ email: 1 }, { unique: true });

userSchema.statics.saveUser = function (userData,  callback) {

    //Hash genera codigo incluso con un undefined, por eso comprobamos primero
    if (typeof userData.passw === 'undefined'){
        return callback(errorManager(new Error('USER_EXIST')));
    }
    let user = new User({name:userData.name,
        email:userData.email,
        passw:hash.sha256().update(userData.passw).digest('hex')});

    user.save(function (err, saved) {
        if (err){
            return callback(err);
        }
        //No envio el hash/password guardado
        return callback(null, ({name:saved.name, email:saved.email}));
    })
};

userSchema.statics.findUser = function (userData, callback) {
    
    User.findOne({email:userData.email}).exec(function (err, user) {
        if (err){
            return callback(err);
        }
        return callback(null, user)
    })
};

let User = mongoose.model('User', userSchema);