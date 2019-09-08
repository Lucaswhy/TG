const express = require('express');
const router = express.Router();
const Usuarios = require('../models/Usuarios');

router.get("/", function(req,res){
    req.body.nome;
    res.render('../public/login', {layout: false});
});

router.post("/home", function(req,res){
    Usuarios.findAll().then(function(usuarios){
    res.render('../public/home', {Nome: "lulu"});
    })
});

router.post("/validacadastro", function(req,res){
    Usuarios.create({
        Cracha: req.body.Cracha,
        Nome: req.body.Nome,
        CPF: req.body.CPF,
        Cargo: req.body.Cargo,
        DataNascimento: req.body.DataNascimento,
        DataAdmissao: req.body.DataAdmissao,
        Email: req.body.Email, 
        Senha: req.body.Senha
    }).then(function(){
    res.redirect('/usuariocadastrado');
    }).catch(function(erro){
        res.send("Usuário não cadastrado. Erro:" + erro);
    });
});

router.get("/usuariocadastrado", function(req,res){
    res.render('../public/usuariocadastrado')
});

router.get("/usuariodeletar/:Cracha", function(req,res){
    Usuarios.destroy({where: {'Cracha' : req.params.Cracha}}).then(function(){
        res.send("Postagem deletada com sucesso.");
    }).catch(function(erro){
        res.send("Usuário não deletado. Erro:" + erro);
    })
});

router.get('/consultarusuario', function(req,res){
 Usuarios.findAll({order: [['Cracha','ASC']]}).then(function(usuarios){
    console.log(usuarios);
    res.render('../public/consultarusuario', {usuarios: usuarios});
})
});

router.get("/cadastrarusuario", function(req,res){
    res.render('../public/cadastrarusuario', {layout: false});
});


module.exports = router