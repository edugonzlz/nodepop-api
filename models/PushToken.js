"use strict";

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios', 'android']},
    token: String,
    userId: String
});

pushTokenSchema.statics.saveToken = function (user, token) {

    //Buscamos un token que exista con el id de usuario
    PushToken.findOne({userId: user._id}).exec(function (err, tokenFound) {
        if (err) {
            return res.status(500).json({success: false, error: err});
        }
        //Si no existe creamos uno y guardamos el token creado
        if (!tokenFound) {
            let pushToken = new PushToken({token: token, userId: user._id});

            pushToken.save(function (err, saved) {
                if (err) {
                    return next(err);
                }
                return console.log('token guardado por primera vez para este usuario:', user.name, saved);
            });
        }
        //si existe lo actualizamos
        console.log('token encontrado y actualizado');
        return PushToken.update({userId: user._id}, {token: token}).exec();
    });
};

let PushToken = mongoose.model('PushToken', pushTokenSchema);