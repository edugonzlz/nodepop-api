"use strict";

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['iOS', 'AndroidOS']},
    token: String,
    userId: String
});

pushTokenSchema.statics.saveToken = function (user, pushToken, platform, callback) {

    //Si el usuario no existe creamos un nuevo token
    if (user === null){
        let newPushToken = new PushToken({platform: platform, token: pushToken});

        newPushToken.save(function (err, saved) {
            if (err) {
                return callback(err);
            }
            console.log('token guardado por primera vez para un usuario NO registrado', pushToken);
            return callback(err, saved);
        });
        
    } else {

        //Buscamos un pushToken que exista con el id de usuario
        PushToken.findOne({userId: user._id}).exec(function (err, tokenFound) {
            if (err) {
                return callback(err);
            }

            //Si no existe el pushToken, creamos uno y lo guardamos
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

            //si existe un id de usuario, actualizamos su token con el nuevo que nos pasan
            console.log('Token encontrado y actualizado para este usuario', user.name, pushToken);
            PushToken.update({userId: user._id}, {platform: platform, token: pushToken}).exec(function (err, saved) {
                if (err) {
                    return callback(err);
                }
                return callback(null, saved);
            });
        });
    }
};

let PushToken = mongoose.model('PushToken', pushTokenSchema);