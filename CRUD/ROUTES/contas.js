const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Contas"); 
const Conta = mongoose.model('conta');

//Cadastrar Contas boyz
router.get("/cadastrarcontas", function(req,res){
    res.render('../public/cadastrarcontas');
});

router.post("/validacontas", function(req,res){

    const novaConta = {
    tipoConta: req.body.tipoconta,
    codConta: req.body.CodConta,
    valConta: req.body.ValConta,
    nomeFornecedor: req.body.NomeFornecedor,
    Juros: req.body.Juros,
    Multa: req.body.Multa,
    Desconto: req.body.Desconto,
    dataEmissao: req.body.DataEmissao,
    dataVencimento: req.body.DataVencimento,
    codigoBarras: req.body.CodBarras,
    Observacao: req.body.Observacao,
    Descricao: req.body.Descricao
}

new Conta(novaConta).save().then(function(){
res.redirect('/contacadastrada');
}).catch(function(erro){
    req.flash("error_msg", "Erro ao cadastrar conta. Erro:" + erro);
});

});

router.get("/contacadastrada", function(req,res){
res.render('../public/contacadastrada')
});

//Consultar Boyzzzzzzzzzzzzzzzz
router.get('/consultarcontas', function(req,res){
    Conta.find().sort({codConta: 'asc'}).then((conta) =>{
       res.render('../public/consultarcontas', {conta: conta});
       }).catch((erro) => {
           req.flash("error_msg","Erro ao consultar contas. Erro:");
       }); 
   });
//Deletar Boyzzzzzzzzzzzzzzzzzz
router.get("/deletarcontas/:id", function(req,res){
    Conta.findOneAndDelete({_id : req.params.id}).then((conta) =>{
        req.flash("success_msg","Conta deletada. ");
        res.redirect('/consultarcontas');
         }).catch((erro) =>{
        req.flash("error_msg","Conta não encontrada. Erro:" + erro);
    })
});
//Editar BOOOOOOOOOOOOOOOOOOOOOOOOOYZZZZZZZZZZ
router.get("/editarcontas/:id", function(req,res){
    Conta.findOne({_id: req.params.id}).then((conta) =>{
    res.render('../public/editarcontas', {conta: conta});
    }).catch((erro) =>{
        req.flash("error_msg", "Conta não encontrada. Erro: " + erro);
        res.redirect("/consultarcontas");
    });
});

router.post("/contaedicao", function(req,res){
    Conta.findOne({codConta: req.body.CodConta}).then((conta)=>{
        
        conta.tipoConta = req.body.tipoconta
        conta.codConta = req.body.NumConta
        conta.valConta = req.body.ValConta
        conta.nomeFornecedor = req.body.NomeFornecedor
        conta.Juros = req.body.Juros
        conta.Multa = req.body.Multa
        conta.Desconto = req.body.Desconto
        conta.dataEmissao = req.body.DataEmissao
        conta.dataVencimento = req.body.DataVencimento
        conta.codigoBarras = req.body.CodBarras
        conta.Observacao = req.body.Observacao
        conta.Descricao = req.body.Descricao
    
        conta.save().then(() => {
            req.flash("success_msg","Conta editado com sucesso!");
            res.redirect("/consultarcontas");
        }).catch((erro) =>{
            req.flash("error_msg" + "Conta não editado. Erro: ");
            res.redirect("/consultarcontas");
        })
    })
});

module.exports = router