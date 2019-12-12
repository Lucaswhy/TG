const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model('usuario');
require("../models/Contas");
const Conta = mongoose.model('conta');

const passport = require("passport");

const {isAdmin} = require("../helpers/isAdmin");
const {home} = require("../helpers/home");

//FUNCOES GLOBAIS

function validaCPF(cpf){

    var i = 0; // index de iteracao

    if (cpf == "00000000000000" || 
        cpf == "11111111111111" || 
        cpf == "22222222222222" || 
        cpf == "33333333333333" || 
        cpf == "44444444444444" || 
        cpf == "55555555555555" || 
        cpf == "66666666666666" || 
        cpf == "77777777777777" || 
        cpf == "88888888888888" || 
        cpf == "99999999999999")
        return false;

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
    } 
    
    else {
    return false
    }
}

//LOGIN E HOME

router.get("/", function(req,res){
    res.render('../public/login', {layout: false});
});

router.post("/validalogin", function(req,res,next){
    passport.authenticate("local",{
        successRedirect: "/home" ,
        failureRedirect: "/",
        failureFlash: true
    })(req,res,next)
}); 

router.get("/home", home, function(req,res){
    Usuario.find({LoginStatus: false}).then((usuario) =>{
        Usuario.find({flagSenha: true}).then((novaSenha)=> {
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 
        today = mm + '/' + dd + '/' + yyyy;

        Conta.find({dataVencimento: yyyy+"-"+mm+"-"+dd+"T00:00:00.000Z"}).then((conta)=>{
        res.render('../public/home', {conta: conta,usuario: usuario,novaSenha: novaSenha});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro no banco.");
    }); 
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro no banco.");
    });
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro no banco.");
});
});

router.get("/homeusuario", function(req,res){
    Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
        res.render('../public/homeusuario', {usuario: usuario});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro no banco.");
        }); 
});

router.get("/esqueciminhasenha", function(req,res){
    res.render('../public/esqueciminhasenha', {layout: false});
});

router.post("/validasenha", function(req,res){

    var count = 0;
    var erros = [];

    if (req.body.NSenha.length < 5){
        erros.push({texto: "Senha muito curta! Deve ter no mínimo 5 digitos."});
        count++;
    }

    if (req.body.CSenha.length > 12){
        erros.push({texto: "Senha muito longa! Deve ter no máximo 12 digitos."});
        count++;
    }

    if(req.body.NSenha != req.body.CSenha){
        erros.push({texto: "As senhas digitadas são diferentes."});
        count++;
    }

    if(count > 0){
        res.render('../public/esqueciminhasenha',{erros: erros,layout: false});
    }

    else{
        Usuario.findOne({Email: req.body.Email}).then((usuario) =>{
            if(!usuario){
                req.flash("error_msg","Este e-mail não existe no sistema.");
                res.redirect("/esqueciminhasenha");
        }
        else{
            usuario.flagSenha = true;
            usuario.EsqueciSenha = req.body.NSenha;
            
            usuario.save().then(() => {
                req.flash("success_msg","Requisição de senha feita com sucesso! Entre em contato com o administrador.");
                res.redirect("/esqueciminhasenha");
            }).catch((erro) =>{
                console.log(erro);
                req.flash("error_msg","Falha ao requerir a edição de senha.");
                res.redirect("/esqueciminhasenha");
        
            });
         }

    });
}

    
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

    if (req.body.Senha.length > 12){
        erros.push({texto: "Senha muito longa! Deve ter no máximo 12 digitos."});
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

router.get('/consultarusuario', isAdmin, function(req,res){
 Usuario.find().sort({Cracha: 'asc'}).then((usuario) =>{
    res.render('../public/consultarusuario', {usuario: usuario});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os usuários. Erro:");
    }); 
});

router.get('/consultarusuario/:busca',isAdmin, function(req,res){
    if(!isNaN(req.params.busca)){    
        Usuario.find({Cracha: req.params.busca}).sort({Cracha: 'desc'}).then((usuario) =>{
            console.log(req.params.busca);
            console.log(usuario);
        res.render('../public/consultarusuario', {usuario: usuario});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar os usuários. Erro:");
        });
        }
    else{
        Usuario.find({Nome: new RegExp(req.params.busca, "i")}).sort({Nome: 'asc'}).then((usuario) =>{
            res.render('../public/consultarusuario', {usuario: usuario});
            }).catch((erro) => {
                console.log(erro);
                req.flash("error_msg","Erro ao consultar os usuários. Erro:");
            });
        } 
   });

//DELETAR USUÁRIO

router.get("/usuariodeletar/:id", isAdmin, function(req,res){
    Usuario.findOneAndDelete({_id : req.params.id}).then(() =>{
        req.flash("success_msg","Usuário deletado. ");
        res.redirect('/consultarusuario');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Usuário não deletado. Erro:" + erro);
    })
});

//EDITAR USUÁRIO

router.get("/editarusuario/:id", isAdmin, function(req,res){
    Usuario.findOne({_id: req.params.id}).then((usuario) =>{

   res.render('../public/editarusuario', {usuario: usuario});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Usuário não encontrado. Erro: ");
        res.redirect("/consultarusuario");
    });
});

router.post("/validaedicao", isAdmin, function(req,res){

    var count = 0;
    var erros = [];
    var cpf = new String;
    cpf = req.body.CPF;


    if (req.body.Senha.length < 5){
        erros.push({texto: "Senha muito curta! Deve ter no mínimo 5 digitos."});
        count++;
    }

    if (req.body.Senha.length > 12){
        erros.push({texto: "Senha muito longa! Deve ter no máximo 12 digitos."});
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

                        if(req.body.isAdmin == "on"){
                        usuario.isAdmin = true;
                        }

                        if(req.body.cadConta == "on"){
                        usuario.cadConta = true;
                        }
                        else{
                            usuario.cadConta = false;
                        }

                        if(req.body.conConta == "on"){
                            usuario.conConta = true;
                        }
                        else{
                            usuario.conConta = false;
                        }

                        if(req.body.editConta == "on"){
                            usuario.editConta = true;
                            }
                        else{
                            usuario.editConta = false;
                        }

                        if(req.body.delConta == "on"){
                            usuario.delConta = true;
                        }
                        else{
                            usuario.delConta = false;
                        }

                        if(req.body.cadForn == "on"){
                            usuario.cadForn = true;
                        }
                        else{
                            usuario.cadForn = false;
                        }
                    
                        if(req.body.conForn == "on"){
                            usuario.conForn = true;
                        }
                        else{
                            usuario.conForn = false;
                        }
                    
                        if(req.body.editForn == "on"){
                            usuario.editForn = true;
                        }
                        else{
                            usuario.editForn = false;
                        }
                    
                        if(req.body.delForn == "on"){
                            usuario.delForn = true;
                        }
                        else{
                            usuario.delForn = false;
                        }

                        if(req.body.cadBanco == "on"){
                            usuario.cadBanco = true;
                            }
                        else{
                            usuario.cadBanco = false;
                        }
                    
                        if(req.body.conBanco == "on"){
                            usuario.conBanco = true;
                        }
                        else{
                            usuario.conBanco = false;
                        }
                    
                        if(req.body.editBanco == "on"){
                            usuario.editBanco = true;
                        }
                        else{
                            usuario.editBanco = false;
                        }
                    
                        if(req.body.delBanco == "on"){
                            usuario.delBanco = true;
                        }
                        else{
                            usuario.delBanco = false;
                        }

                        if(req.body.cadAgencia == "on"){
                            usuario.cadAgencia = true;
                        }
                        else{
                            usuario.cadAgencia = false;
                        }
                    
                        if(req.body.conAgencia == "on"){
                            usuario.conAgencia = true;
                        }
                        else{
                            usuario.conAgencia = false;
                        }
                    
                        if(req.body.editAgencia == "on"){
                            usuario.editAgencia = true;
                        }
                        else{
                            usuario.editAgencia = false;
                        }
                    
                        if(req.body.delAgencia == "on"){
                            usuario.delAgencia = true;
                        }
                        else{
                            usuario.delAgencia = false;
                        }

                        if(req.body.cadContBanc == "on"){
                            usuario.cadContBanc = true;
                        }
                        else{
                            usuario.cadContBanc = false;
                        }
                    
                        if(req.body.conContBanc == "on"){
                            usuario.conContBanc = true;
                        }
                        else{
                            usuario.conContBanc = false;
                        }
                    
                        if(req.body.editContBanc == "on"){
                            usuario.editContBanc = true;
                        }
                        else{
                            usuario.editContBanc = false;
                        }
                    
                        if(req.body.delContBanc == "on"){
                            usuario.delContBanc = true;
                        }
                        else{
                            usuario.delContBanc = false;
                        }

                        if(req.body.gerarSimulacao == "on"){
                            usuario.gerarSimulacao = true;
                        }
                        else{
                            usuario.gerarSimulacao = false;
                        }
                    
                        if(req.body.emitirRelatorio == "on"){
                            usuario.emitirRelatorio = true;
                        }
                        else{
                            usuario.emitirRelatorio = false;
                        }
                    
                        if(req.body.gerarRemessa == "on"){
                            usuario.gerarRemessa = true;
                        }
                        else{
                            usuario.gerarRemessa = false;
                        }
                        if(req.body.pagarConta == "on"){
                            usuario.pagarConta = true;
                        }
                        else{
                            usuario.pagarConta = false;
                        }
                        if(req.body.conRetorno == "on"){
                            usuario.conRetorno = true;
                        }
                        else{
                            usuario.conRetorno = false;
                        }
        
        
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
router.get("/liberarcadastro/:id", isAdmin, function(req,res){
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

//TROCAR SENHA
router.get("/trocarsenha/:id", isAdmin, function(req,res){
    Usuario.findOne({_id:req.params.id}).then((usuario) =>{
        usuario.flagSenha = false;
        usuario.Senha = usuario.EsqueciSenha;
        usuario.EsqueciSenha = "";
        usuario.save();
    }).then(() =>{
        req.flash("success_msg","Senha alterada com sucesso! ");
        res.redirect('/consultarusuario');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Falha no banco, senha não foi alterada.");
    })
});

//LOGOUT
router.get("/logout", (req,res) =>{
    req.logout();
    req.flash("success_msg","Deslogado com sucesso.");
    res.redirect("/");
});

module.exports = router