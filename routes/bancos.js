const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Bancos"); 
const Banco = mongoose.model('banco');

//Cadastrar Bancos
router.get("/cadastrarbancos", function(req,res){
    res.render('../public/cadastrarbancos');
});

router.post("/validabancos", function(req,res){

    const novoBanco = {
    codBanco: req.body.CodBanco,
    numeroConta: req.body.NumConta,
    Digito: req.body.Digito,
    codAgencia: req.body.CodAgencia,
    nomeAgencia: req.body.Nome,
    gerenteAgencia: req.body.Gerente,
    Logradouro: req.body.Logradouro,
    nBanco: req.body.Banco,
    Tipo: req.body.tipoarq
}

new Banco(novoBanco).save().then(function(){
res.redirect('/bancocadastrado');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar banco.");
});

});

router.get("/bancocadastrado", function(req,res){
res.render('../public/bancocadastrado')
});

//Consultar
router.get('/consultarbancos', function(req,res){
    Banco.find().sort({codBanco: 'asc'}).then((banco) =>{
       res.render('../public/consultarbancos', {banco: banco});
       }).catch((erro) => {
            console.log(erro);
           req.flash("error_msg","Erro ao consultar banco.");
       }); 
   });
//Deletar
router.get("/deletarbanco/:id", function(req,res){
    Banco.findOneAndDelete({_id : req.params.id}).then((banco) =>{
        req.flash("success_msg","Banco deletado. ");
        res.redirect('/consultarbancos');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Banco não encontrado.");
    })
});
//Editar

router.get("/editarbancos/:id", function(req,res){
    Banco.findOne({_id: req.params.id}).then((banco) =>{
    res.render('../public/editarbancos', {banco: banco});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Banco não encontrado.");
        res.redirect("/consultarbancos");
    });
});

router.post("/bancoedicao", function(req,res){
    Banco.findOne({codBanco: req.body.CodBanco}).then((banco)=>{
        
        banco.codBanco = req.body.CodBanco
        banco.numeroConta = req.body.NumConta
        banco.Digito = req.body.Digito
        banco.codAgencia = req.body.CodAgencia
        banco.nomeAgencia = req.body.Nome
        banco.gerenteAgencia = req.body.Gerente
        banco.Logradouro = req.body.Logradouro
        banco.nBanco = req.body.Banco
        banco.numeroAgencia = req.body.NumAgencia
        banco.Tipo = req.body.tipoarq
    
        banco.save().then(() => {
            req.flash("success_msg","Banco editado com sucesso!");
            res.redirect("/consultarbancos");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Banco não editado. Erro: ");
            res.redirect("/consultarbancos");
        })
    })
});
module.exports = router