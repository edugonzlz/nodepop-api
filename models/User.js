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
        //No envio el hash/password guardado
        return callback(err,({name:saved.name, email:saved.email}));
    })
};

userSchema.statics.findUser = function (userName, userMail, userPass, res, callback) {
    
    //Busqueda por mail
    //todo: implementar busque por nombre tambien??
    User.findOne({email:userMail}).exec(function (err, user) {
        if (err){
            return callback(res.status(500).json({success:false, error:err}));
        }
        return callback(null, user)
    })
};

let User = mongoose.model('User', userSchema);