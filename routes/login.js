const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model('usuario');

router.get("/", function(req,res){
    req.body.nome;
    res.render('../public/login', {layout: false});
});

router.post("/home", function(req,res){
   Usuario.find().then(function(usuario){
    res.render('../public/home', {Nome: "Viniciuss"});
    })
});

router.post("/validacadastro", function(req,res){

   // var erros = [];

    // if(req.body.Nome || typeof req.body.Nome == undefined || req.body.Nome == null){
    //    erros.push({text: "N  ome inválido."});
   // }

   //if(erros.lenght > 0){
    //res.ren   der("cadastrarusuario",{{erros: erros}});
   //}

        const novoUsuario = {
        Cracha: req.body.Cracha,
        Nome: req.body.Nome,
        CPF: req.body.CPF,
        Cargo: req.body.Cargo,
        DataNascimento: req.body.DataNascimento,
        DataAdmissao: req.body.DataAdmissao,
        Email: req.body.Email, 
        Senha: req.body.Senha
    }
    
    new Usuario(novoUsuario).save().then(function(){
    res.redirect('/usuariocadastrado');
    }).catch(function(erro){
        req.flash("error_msg", "Erro ao cadastrar usuário. Erro:" + erro);
    });

});

router.get("/usuariocadastrado", function(req,res){
    res.render('../public/usuariocadastrado')
});

router.get("/usuariodeletar/:Cracha", function(req,res){
    Usuario.deleteOne({where: {'Cracha' : req.params.Cracha}}).then(function(){
        req.flash("success_msg","Postagem deletada com sucesso.");
    }).catch(function(erro){
        req.flash("error_msg","Usuário não deletado. Erro:" + erro);
    })
});

router.get('/consultarusuario', function(req,res){
 Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
    res.render('../public/consultarusuario', {usuario: usuario});
    }).catch((erro) => {
        req.flash("error_msg","Erro ao consultar os usuários. Erro:");
    }); 
});

router.get("/cadastrarusuario", function(req,res){
    res.render('../public/cadastrarusuario', {layout: false});
});


module.exports = router