"use strict";

let mongoose = require('mongoose');
let hash = require('hash.js');

let userSchema = mongoose.Schema({
    name: {type: String, index: true, required: true},
    email: {type: String, index: true, required: true},
    passw: {type: String, required: true}
});

userSchema.statics.saveUser = function (userData,  callback) {

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
    
    //Buscamos por email. Usuarios con el mismo nombre pero diferente email son permitidos
    User.findOne({email:userData.email}).exec(function (err, user) {
        if (err){
            return callback(err);
        }
        return callback(null, user)
    })
};

let User = mongoose.model('User', userSchema);