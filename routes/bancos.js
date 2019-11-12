const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Bancos"); 
const Banco = mongoose.model('banco');
const {cadBanco} = require("../helpers/cadBanco");
const {conBanco} = require("../helpers/conBanco");
const {delBanco} = require("../helpers/delBanco");
const {editBanco} = require("../helpers/editBanco");
//Cadastrar Bancos
router.get("/cadastrarbancos", cadBanco, function(req,res){
    res.render('../public/cadastrarbancos');
});

router.post("/validabancos", function(req,res){

    const novoBanco = {
    codBanco: req.body.CodBanco,
    nomeBanco: req.body.NomeBanco,
    CNPJ: req.body.CNPJ,
    numeroBanco: req.body.NumBanco,
    Email: req.body.Email,
    Telefone: req.body.Telefone,
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
router.get('/consultarbancos', conBanco, function(req,res){
    Banco.find().sort({codBanco: 'asc'}).then((banco) =>{
       res.render('../public/consultarbancos', {banco: banco});
       }).catch((erro) => {
            console.log(erro);
           req.flash("error_msg","Erro ao consultar banco.");
       }); 
   });
   router.get('/consultarbancos/:busca',conBanco, function(req,res){
    if(!isNaN(req.params.busca)){    
        Banco.find({codBanco: req.params.busca}).sort({codBanco: 'desc'}).then((banco) =>{
        res.render('../public/consultarbancos', {banco: banco});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar o banco. Erro:");
        });
        }
    else{
        Banco.find({nomeBanco: new RegExp(req.params.busca, "i")}).sort({nomeBanco: 'asc'}).then((banco) =>{
            res.render('../public/consultarbancos', {banco: banco});
            }).catch((erro) => {
                console.log(erro);
                req.flash("error_msg","Erro ao consultar o banco. Erro:");
            });
        } 
   });
//Deletar
router.get("/deletarbanco/:id", delBanco, function(req,res){
    Banco.findOneAndDelete({_id : req.params.id}).then((banco) =>{
        req.flash("success_msg","Banco deletado. ");
        res.redirect('/consultarbancos');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Banco não encontrado.");
    })
});
//Editar

router.get("/editarbancos/:id", editBanco, function(req,res){
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
        
        banco.codBanco = req.body.CodBanco,
        banco.nomeBanco = req.body.NomeBanco,
        banco.CNPJ = req.body.CNPJ,
        banco.numeroBanco =  req.body.NumBanco,
        banco.Email =  req.body.Email,
        banco.Telefone =  req.body.Telefone,
    
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