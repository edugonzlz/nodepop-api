/**
 * Created by Edu on 29/4/16.
 */
"use strict";

let jwt = require('jsonwebtoken');
let config = require('../../local_config');

let express = require('express');
let router = express.Router();

let User = require('mongoose').model('User');
let PushToken = require('mongoose').model('PushToken');

let hash = require('hash.js');
let mobileDetect = require('mobile-detect');
let errorManager = require('../../lib/errorManager');

router.post('/register',function (req, res) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = req.body.passw;
    
    //Hash genera codigo incluso con un undefined, por eso comprobamos primero
    if (typeof userPass === 'undefined'){
        return errorManager(new Error('PASS_REQUIRED'), req, res);
    }
    
    let userData = new User({name:userName, email:userMail, passw:userPass});
    
    //Comprobamos si ya existe
    User.findUser(userData, function (err, user) {
        if (err){
            return errorManager(err, req, res);
        }
        //Si ya existe
        if (user){
            return errorManager(new Error('USER_EXIST'), req, res);
        }
        //Si no existe creamos uno
        User.saveUser(userData, function (err, saved) {
            if (err){
                return errorManager(err, req, res);
            }
            return res.json({success:true, saved:saved})
        });

    })
});

router.post('/authenticate', function (req, res) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;

    //Convertimos a un hash aqui, porque necesitamos comprobar la contraseña hasheada
    let userPass = hash.sha256().update(req.body.passw).digest('hex');

    let userData = new User({name:userName, email:userMail});

    //Buscamos el usuario en la base de datos
    User.findUser(userData, function (err, user) {
        if (err){
            return errorManager(err, req, res);
        }
        if (!user){
            return errorManager(new Error('USER_OR_MAIL_NOT_FOUND'), req, res);
        }
        if (user.passw !== userPass){
            return errorManager(new Error('PASS_INCORRECT'), req, res);
        }
        //Creamos el token con la clave del fichero de configuracion y lo devolvemos
        let token = jwt.sign({id:user._id},config.jwt.secret, {expiresIn:60*60*2*24});

        return res.json({success:true, token:token})
    })
});

router.put('/pushtoken', function (req, res) {

    let userName = req.body.name;
    let userMail = req.body.email;
    let pushToken = req.query.pushtoken;

    let userData = new User({name:userName, email:userMail});

    let md = new mobileDetect(req.headers['user-agent']);
    //Si consultamos desde un movil mobileDetect detectara la plataforma
    //Para detectarla desde otra plataforma se requiere una query
    let platform = md.os() || req.query.platform;

    User.findUser(userData, function (err, user) {
        if (err){
            return errorManager(err, req, res);
        }
        
        PushToken.saveToken(user, pushToken, platform, function (err, saved) {
            if (err) {
                return errorManager(err, req, res);
            }
            return res.json({success: true, saved: saved});
        });

        // //Guardamos el token para un usuario NO registrado
        // if (!user){
        //     PushToken.saveToken(null, pushToken, platform, function (err, saved ) {
        //         if (err){
        //             return errorManager(err, req, res);
        //         }
        //         return res.json({success:true, saved:saved});
        //     });
        // }
        //
        // //Guardamos el token para un usuario registrado
        // if (user) {
        //     PushToken.saveToken(user, pushToken, platform, function (err, saved) {
        //         if (err) {
        //             return errorManager(err, req, res);
        //         }
        //         return res.json({success: true, saved: saved});
        //     });
        // }
    })
});

module.exports= router;