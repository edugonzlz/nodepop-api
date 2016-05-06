"use strict";

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['iOS', 'AndroidOS']},
    token: String,
    userId: String
});

pushTokenSchema.statics.saveToken = function (user, pushToken, platform, callback) {

    //Buscamos un token que exista con el id de usuario
    PushToken.findOne({userId: user._id}).exec(function (err, tokenFound) {
        if (err) {
            return callback(err);
        }
        //Si no existe creamos uno y guardamos el token creado
        if (!tokenFound) {
            let newPushToken = new PushToken({platform: platform, token: pushToken, userId: user._id});

            newPushToken.save(function (err, saved) {
                if (err) {
                    return callback(err);
                }
                console.log('token guardado por primera vez para este usuario:', user.name, pushToken);
                return callback(null, saved);
            });
        }
        //si existe lo actualizamos
        console.log('token encontrado y actualizado', pushToken);
        PushToken.update({userId: user._id}, {platform: platform, token: pushToken}).exec(function (err, saved) {
            if (err){
                return callback(err);
            }
            return callback(null, saved);
        });
    });
};

let PushToken = mongoose.model('PushToken', pushTokenSchema);