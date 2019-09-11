const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model('usuario');

//LOGIN E HOME

router.get("/", function(req,res){
    req.body.nome;
    res.render('../public/login', {layout: false});
});

router.post("/home", function(req,res){
   Usuario.find().then(function(usuario){
    res.render('../public/home', {usuario: usuario});
    })
});

//CADASTRAR USUÁRIO

router.get("/cadastrarusuario", function(req,res){
    res.render('../public/cadastrarusuario', {layout: false});
});

router.post("/validacadastro", function(req,res){

   // var erros = [];

    // if(req.body.Nome || typeof req.body.Nome == undefined || req.body.Nome == null){
    //    erros.push({text: "N  ome inválido."});
   // }

   //if(erros.lenght > 0){
    //res.render("cadastrarusuario",{{erros: erros}});
   //}

        const novoUsuario = {
        Cracha: req.body.Cracha,
        Nome: req.body.Nome,
        CPF: req.body.CPF,
        Cargo: req.body.Cargo,
        DataNascimento: req.body.DataNascimento,
        DataAdmissao: req.body.DataAdmissao,
        Logradouro: req.body.Logradouro,
        Numero: req.body.Numero,
        Bairro: req.body.Bairro,
        Cidade: req.body.Cidade,
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

//CONSULTAR USUÁRIO

router.get('/consultarusuario', function(req,res){
 Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
    res.render('../public/consultarusuario', {usuario: usuario});
    }).catch((erro) => {
        req.flash("error_msg","Erro ao consultar os usuários. Erro:");
    }); 
});

//DELETAR USUÁRIO

router.get("/usuariodeletar/:id", function(req,res){
    Usuario.findOneAndDelete({_id : req.params.id}).then((usuario) =>{
        req.flash("success_msg","Usuário deletado. ");
        res.redirect('/consultarusuario');
         }).catch((erro) =>{
        req.flash("error_msg","Usuário não deletado. Erro:" + erro);
    })
});

//EDITAR USUÁRIO

router.get("/editarusuario/:id", function(req,res){
    Usuario.findOne({_id: req.params.id}).then((usuario) =>{

        //usuario.DataNascimento = moment().format("dd/MM/yyyy")
        //moment(usuario.DataAdmissao).format("dd/MM/yyyy");

   res.render('../public/editarusuario', {usuario: usuario});
    }).catch((erro) =>{
        req.flash("error_msg", "Usuário não encontrado. Erro: " + erro);
        res.redirect("/consultarusuario");
    });
});

router.post("/validaedicao", function(req,res){
    Usuario.findOne({Cracha: req.body.Cracha}).then((usuario)=>{
        
        usuario.Cracha = req.body.Cracha
        usuario.Nome = req.body.Nome
        usuario.CPF = req.body.CPF
        usuario.Cargo = req.body.Cargo
        usuario.DataNascimento = req.body.DataNascimento
        usuario.DataAdmissao = req.body.DataAdmissao
        usuario.Logradouro = req.body.Logradouro
        usuario.Numero = req.body.Numero
        usuario.Bairro = req.body.Bairro
        usuario.Cidade = req.body.Cidade
        usuario.Email = req.body.Email
        usuario.Senha = req.body.Senha
    
        usuario.save().then(() => {
            req.flash("success_msg","Usuário editado com sucesso!");
            res.redirect("/consultarusuario");
        }).catch((erro) =>{
            req.flash("error_msg" + "Usuário não editado. Erro: ");
            res.redirect("/consultarusuario");
        })
    })
});

module.exports = router