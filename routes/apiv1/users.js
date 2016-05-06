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

router.post('/register',function (req, res) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = req.body.passw;
    
    let userData = new User({name:userName, email:userMail, passw:userPass});
    //Comprobamos si ya existe
    User.findUser(userData, function (err, user) {
        if (err){
            return res.status(500).json({success:false, error:err});
        }
        //Si ya existe
        if (user){
            return res.json({success:false, err:'El usuario ya existe'});
        }
        //Si no existe creamos uno
        User.saveUser(userData, function (err, saved) {
            if (err){
                return res.status(500).json({success:false, err:err});
            }
            return res.json({success:true, saved:saved})
        });

    })
});

router.post('/authenticate', function (req, res) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = hash.sha256().update(req.body.passw).digest('hex');

    let userData = new User({name:userName, email:userMail});

    //Buscamos el usuario en la base de datos
    User.findUser(userData, function (err, user) {
        if (err){
            return res.status(500).json({success:false, error:err});
        }
        if (!user){
            return res.status(401).json({success:false, error:'Authetication failed. User name or email is not found'});
        }
        if (user.passw !== userPass){
            return res.status(401).json({success:false, error:'Authentication failed. The password is not correct'});
        }
        //Creamos el token con la clave del fichero de configuracion y lo devolvemos
        let token = jwt.sign({id:user._id},config.jwt.secret, {expiresIn:60*60*2*24});

        return res.json({success:true, token:token})
    })
});

router.put('/pushtoken', function (req, res) {

    let userName = req.body.name;
    let userMail = req.body.email;
    let userData = new User({name:userName, email:userMail});

    let pushToken = req.query.pushtoken;

    let md = new mobileDetect(req.headers['user-agent']);
    //Si consultamos desde un movil detectara la plataforma
    //Para detectarla desde otra plataforma se requiere una query
    let platform = md.os() || req.query.platform;

    User.findUser(userData, function (err, user) {
        if (err){
            return res.status(500).json({success:false, error:err});
        }
        if (!user){
            //todo: Guardamos token si no existe usuario???
            return res.status(401).json({success:false, error:' User name or email is not found'});
        }
        //Guardamos el token
        PushToken.saveToken(user, pushToken, platform, function (err, saved ) {
            if (err){
                return res.status(500).json({success: false, error: err});
            }
            return res.json({success:true, saved:saved});
        });
    })
});

module.exports= router;