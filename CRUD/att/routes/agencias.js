const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Agencias"); 
const Agencia = mongoose.model('agencia');
require("../models/Bancos"); 
const Banco = mongoose.model('banco');

//Cadastrar Bancos
router.get("/cadastraragencias", (req,res) => {
	Banco.find().then((banco) =>{
	res.render("../public/cadastraragencias", {banco: banco});
	}).catch((erro) =>{
	console.log(erro);
	});
})

router.post("/validaagencias", function(req,res){

    const novaAgencia = {
    nomeBanco: req.body.nomeBanco,
    codAgencia: req.body.CodAgencia,
    numAgencia: req.body.NumAgencia,
    gerAgencia: req.body.GerAgencia,
    telAgencia: req.body.Tel,
    cepAgencia: req.body.CEP,
    endAgencia: req.body.EnderecoAgencia,
    cidadeAgencia: req.body.Cidade,
    estadoAgencia: req.body.Estado
}

new Agencia(novaAgencia).save().then(function(){
res.redirect('/agenciacadastrada');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar agencia.");
});

});

router.get("/agenciacadastrado", function(req,res){
res.render('../public/agenciacadastrada')
});

//Consultar
router.get('/consultaragencia', function(req,res){
    Agencia.find().sort({codBanco: 'asc'}).then((agencia) =>{
       res.render('../public/consultaragencia', {agencia: agencia});
       }).catch((erro) => {
            console.log(erro);
           req.flash("error_msg","Erro ao consultar agencia.");
       }); 
   });
//Deletar
router.get("/deletaragencia/:id", function(req,res){
    Agencia.findOneAndDelete({_id : req.params.id}).then((agencia) =>{
        req.flash("success_msg","Agencia deletada. ");
        res.redirect('/consultaragencia');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Agencia não encontrada.");
    })
});
//Editar

router.get("/editaragencias/:id", function(req,res){
    Agencia.findOne({_id: req.params.id}).then((agencia) =>{
    res.render('../public/editaragencias', {agencia: agencia});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Agencia não encontrada.");
        res.redirect("/consultaragencia");
    });
});

router.post("/agenciaedicao", function(req,res){
    Agencia.findOne({codAgencia: req.body.CodAgencia}).then((agencia)=>{
        
        agencia.nomeBanco = req.body.nomeBanco
        agencia.codBanco = req.body.CodBanco
        agencia.numAgencia = req.body.NumAgencia
        agencia.gerAgencia = req.body.GerAgencia
        agencia.telAgencia = req.body.Tel
        agencia.cepAgencia = req.body.CEP
        agencia.endAgencia = req.body.EnderecoAgencia
        agencia.cidadeAgencia = req.body.Cidade
        agencia.estadoAgencia = req.body.Estado
    
        agencia.save().then(() => {
            req.flash("success_msg","Agencia editada com sucesso!");
            res.redirect("/consultaragencia");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Agencia não editada. Erro: ");
            res.redirect("/consultaragencia");
        })
    })
});
module.exports = router