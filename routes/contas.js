const express = require('express');
const router = express.Router();

router.get("/cadastrarcontas", function(req,res){
    res.render('../public/cadastrarcontas');
});

router.get("/consultarcontas", function(req,res){ 
    res.render('../public/consultarcontas');
});

module.exports = router