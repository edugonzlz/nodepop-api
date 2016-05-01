"use strict";

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    plataform: {type: String, enum: ['ios', 'android']},
    token: String,
    userId: String
});

pushTokenSchema.statics.save = function (user, token) {

    // if (!PushToken) {
    //     let tokenInit = new PushToken();
    // }
    //Buscamos un token que exista con el id de usuario
    PushToken.findOne({userId: user._id}).exec(function (err, tokenFound) {
        if (err) {
            return res.status(500).json({success: false, error: err});
        }//Si no existe creamos uno y guardamos el token creado
        if (!tokenFound) {
            let userToken = new PushToken({token: token, userId: user._id});

            console.log('token guardado por primera vez para este usuario:', user.name);
            return userToken.save(function (err, saved) {
                if (err) {
                    return next(err);
                }
            });
        }//si existe lo actualizamos
        if (tokenFound) {
            console.log('token encontrado y actualizado');
            PushToken.update({userId: user._id}, {token: token}).exec();
        }
    });
};

let PushToken = mongoose.model('PushToken', pushTokenSchema);