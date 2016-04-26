/**
 * Created by Edu on 26/4/16.
 */
"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;

//Configuramos los handlers de eventos de conexion
conn.on('error',console.log.bind(console, 'conecction error'));
conn.once('open', function () {
    console.log('Conected to mongoDB');
});

//Conectamos la base de datos
mongoose.connect('mongodb://localhost:27017/nodepop');