/**
 * Created by Edu on 26/4/16.
 */
"use strict";

var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.send("Mostrando todos los articulos de Nodepop");
});

module.exports = router;