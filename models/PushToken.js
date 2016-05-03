"use strict";

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios', 'android']},
    token: String,
    userId: String
});

pushTokenSchema.statics.saveToken = function (user, pushToken, callback) {

    //Buscamos un token que exista con el id de usuario
    PushToken.findOne({userId: user._id}).exec(function (err, tokenFound) {
        if (err) {
            return callback(err);
        }
        //Si no existe creamos uno y guardamos el token creado
        if (!tokenFound) {
            let newPushToken = new PushToken({token: pushToken, userId: user._id});

            newPushToken.save(function (err, saved) {
                if (err) {
                    return callback(err);
                }
                console.log('token guardado por primera vez para este usuario:', user.name, saved.token);
                return callback(null, saved);
            });
        }
        //si existe lo actualizamos
        console.log('token encontrado y actualizado');
        PushToken.update({userId: user._id}, {token: pushToken}).exec(function (err, saved) {
            if (err){
                return callback(err);
            }
            return callback(null, saved);
        });
    });
};

let PushToken = mongoose.model('PushToken', pushTokenSchema);