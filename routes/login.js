const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model('usuario');

const passport = require("passport");

//FUNCOES GLOBAIS
function validaCPF(cpf){

    var i = 0; // index de iteracao

    if(cpf == "00000000000"){
        return false;
    }

    if(cpf == "11111111111"){
        return false;
    }

    if(cpf == "22222222222"){
        return false;
    }

    if(cpf == "33333333333"){
        return false;
    }

    if(cpf == "44444444444"){
        return false;
    }

    if(cpf == "55555555555"){
        return false;
    }

    if(cpf == "66666666666"){
        return false;
    }

    if(cpf == "77777777777"){
        return false;
    }

    if(cpf == "88888888888"){
        return false;
    }

    if(cpf == "99999999999"){
        return false;
    }

    var somatoria = 0;
    var cpf = cpf.toString().split("");
    var dv11 = cpf[cpf.length - 2]; // mais significativo
    var dv12 = cpf[cpf.length - 1]; // menos significativo
    cpf.splice(cpf.length - 2, 2); // remove os digitos verificadores originais

    for(i = 0; i < cpf.length; i++) {
    somatoria += cpf[i] * (10 - i);
    }

    var dv21 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
    cpf.push(dv21);
    somatoria = 0;

    for(i = 0; i < cpf.length; i++) {
    somatoria += cpf[i] * (11 - i);
    }
    
    var dv22 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));

    if (dv11 == dv21 && dv12 == dv22) {
    return true
    } else {
    return false
        }
}

//LOGIN E HOME

router.get("/", function(req,res){
    res.render('../public/login', {layout: false});
});

/*router.post("/", function(req,res,next){
    passport.authenticate("local",{
        successRedirect: "/home" ,
        failureRedirect: "/",
        failureFlash: true
    })(req,res,next)
}); */

router.post("/home", function(req,res){
    Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
        res.render('../public/home', {usuario: usuario});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao realizar login.");
        }); 
});

//CADASTRAR USUÁRIO

router.get("/cadastrarusuario", function(req,res){
    res.render('../public/cadastrarusuario', {layout: false});
});

router.post("/cadastrarusuario", function(req,res){

    var count = 0;
    var erros = [];
    var cpf = new String;
    cpf = req.body.CPF;


    if (req.body.Senha.length < 5){
        erros.push({texto: "Senha muito curta! Deve ter no mínimo 5 digitos."});
        count++;
    }

    if (req.body.Senha.length > 10){
        erros.push({texto: "Senha muito longa! Deve ter no máximo 10 digitos."});
        count++;
    }

    if (req.body.Numero <= 0){
        erros.push({texto: "Número de endereço inválido."});
        count++;
    }

    if (req.body.Cracha <= 0){
        erros.push({texto: "Crachá inválido."});
        count++;
    }

    if (validaCPF(cpf) == false){
        erros.push({texto: "CPF inválido."});
        count++;
    } 

    if(req.body.Senha != req.body.Senha2){
        erros.push({texto: "As senhas digitadas são diferentes."});
        count++;
    }

   if(count > 0){
    res.render('../public/cadastrarusuario',{layout: false,erros: erros});
   }

   else{

        Usuario.findOne({Email: req.body.Email}).then((usuario) =>{
            if(usuario){
                req.flash("error_msg","Erro! E-mail já cadastrado no sistema. Fale com o Administrador.");
                res.redirect("/cadastrarusuario");
            }else{

                
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
            Estado: req.body.Estado,
            Email: req.body.Email, 
            Senha: req.body.Senha,
        }
        
        new Usuario(novoUsuario).save().then(function(){
        res.redirect('/usuariocadastrado');
        }).catch(function(erro){
            console.log(erro);
            req.flash("error_msg", "Erro ao cadastrar usuário." );
            res.redirect("/cadastrarusuario");
        });


            }
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg", "Erro ao se cadastrar.");
            res.redirect("/cadastrarusuario");
        })

}});


router.get("/usuariocadastrado", function(req,res){
    res.render('../public/usuariocadastrado')
});

//CONSULTAR USUÁRIO

router.get('/consultarusuario', function(req,res){
 Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
    res.render('../public/consultarusuario', {usuario: usuario});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os usuários. Erro:");
    }); 
});

//DELETAR USUÁRIO

router.get("/usuariodeletar/:id", function(req,res){
    Usuario.findOneAndDelete({_id : req.params.id}).then(() =>{
        req.flash("success_msg","Usuário deletado. ");
        res.redirect('/consultarusuario');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Usuário não deletado. Erro:" + erro);
    })
});

//EDITAR USUÁRIO

router.get("/editarusuario/:id", function(req,res){
    Usuario.findOne({_id: req.params.id}).then((usuario) =>{

   res.render('../public/editarusuario', {usuario: usuario});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Usuário não encontrado. Erro: ");
        res.redirect("/consultarusuario");
    });
});

router.post("/validaedicao", function(req,res){

    var count = 0;
    var erros = [];
    var cpf = new String;
    cpf = req.body.CPF;


    if (req.body.Senha.length < 5){
        erros.push({texto: "Senha muito curta! Deve ter no mínimo 5 digitos."});
        count++;
    }

    if (req.body.Senha.length > 10){
        erros.push({texto: "Senha muito longa! Deve ter no máximo 10 digitos."});
        count++;
    }

    if (req.body.Numero <= 0){
        erros.push({texto: "Número de endereço inválido."});
        count++;
    }

    if (req.body.Cracha <= 0){
        erros.push({texto: "Crachá inválido."});
        count++;
    }

    if (validaCPF(cpf) == false){
        erros.push({texto: "CPF inválido."});
        count++;
    } 

    if(req.body.Senha != req.body.Senha2){
        erros.push({texto: "As senhas digitadas são diferentes."});
        count++;
    }

   if(count > 0){
    res.render('../public/editarerro',{erros: erros});
   }

   else{ 
       
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
        usuario.Estado = req.body.Estado
        usuario.Email = req.body.Email
        usuario.Senha = req.body.Senha
    
        usuario.save().then(() => {
            req.flash("success_msg","Usuário editado com sucesso!");
            res.redirect("/consultarusuario");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Usuário não editado.");
            res.redirect("/consultarusuario");
        })
    })}
});

//LIBERAR CADASTRO
router.get("/liberarcadastro/:id", function(req,res){
    Usuario.findOne({_id:req.params.id}).then((usuario) =>{
        usuario.LoginStatus = true;
        usuario.save();
    }).then(() =>{
        req.flash("success_msg","Cadastro liberado com sucesso! ");
        res.redirect('/consultarusuario');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Usuário não liberado.");
    })
});

module.exports = router