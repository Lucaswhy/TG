const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Contabancaria"); 
const Contabancaria = mongoose.model('contabancaria');
require("../models/Agencias"); 
const Agencia = mongoose.model('agencia');

//Cadastrar Bancos
router.get("/cadastrarcontabancaria", (req,res) => {
	Agencia.find().then((agencia) =>{
	res.render("../public/cadastrarcontabancaria", {agencia: agencia});
	}).catch((erro) =>{
	console.log(erro);
	});
})

router.post("/validacontabancaria", function(req,res){

    const novaContaBancaria = {
    codContaBanc: req.body.CodContaBanc,
    numeroContaBanc: req.body.NumContaBanc,
    Digito: req.body.Digito,
    Saldo: req.body.Saldo,
    SituacaoContaBanc: req.body.SituacaoConta,
    DataAbertura: req.body.DataAbertura,
    Titular: req.body.Titular,
    nomeAgencia: req.body.nomeAgencia
}

new Contabancaria(novaContaBancaria).save().then(function(){
res.redirect('/contabancariacadastrada');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar a conta.");
});

});

router.get("/contabancariacadastrada", function(req,res){
res.render('../public/contabancariacadastrada')
});

//Consultar
router.get('/consultarcontabancaria', function(req,res){
    Contabancaria.find().sort({codContaBanc: 'asc'}).then((contabancaria) =>{
       res.render('../public/consultarcontabancaria', {contabancaria: contabancaria});
       }).catch((erro) => {
            console.log(erro);
           req.flash("error_msg","Erro ao consultar banco.");
       }); 
   });
//Deletar
router.get("/deletarcontabancaria/:id", function(req,res){
    Contabancaria.findOneAndDelete({_id : req.params.id}).then((contabancaria) =>{
        req.flash("success_msg","Conta deletada. ");
        res.redirect('/consultarcontabancaria');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Conta não encontrada.");
    })
});
//Editar

router.get("/editarcontabancaria", (req,res) => {
	Agencia.find().then((agencia) =>{
	res.render("../public/editarcontabancaria", {agencia: agencia});
	}).catch((erro) =>{
	console.log(erro);
	});
});
router.get("/editarcontabancaria/:id", function(req,res){
    Contabancaria.findOne({_id: req.params.id}).then((contabancaria) =>{
    res.render('../public/editarcontabancaria', {contabancaria: contabancaria});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Conta não encontrado.");
        res.redirect("/consultarcontabancaria");
    });
});

router.post("/contabancariaedicao", function(req,res){
    Contabancaria.findOne({codContaBanc: req.body.CodContaBanc}).then((contabancaria)=>{
        
        contabancaria.codContaBanc = req.body.CodContaBanc
        contabancaria.numeroContaBanc = req.body.NumContaBanc
        contabancaria.Digito = req.body.Digito
        contabancaria.Saldo = req.body.Saldo
        contabancaria.SituacaoContaBanc = req.body.SituacaoConta
        contabancaria.DataAbertura = req.body.DataAbertura
        contabancaria.Titular = req.body.Titular
        contabancaria.nomeAgencia = req.body.nomeAgencia
        contabancaria.save().then(() => {
            req.flash("success_msg","Conta editada com sucesso!");
            res.redirect("/consultarcontabancaria");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Conta não editado. Erro: ");
            res.redirect("/consultarcontabancaria");
        })
    })
});
module.exports = router