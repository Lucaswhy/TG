const moment = require('moment');
const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Contas"); 
const Conta = mongoose.model('conta');

require("../models/Contabancaria"); 
const Contabancaria = mongoose.model('contabancaria');

const {cadConta} = require("../helpers/cadConta");
const {conConta} = require("../helpers/conConta");
const {delConta} = require("../helpers/delConta");
const {editConta} = require("../helpers/editConta");
//Cadastrar Contas boyz
router.get("/cadastrarcontas", cadConta, function(req,res){
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
    Situacao: req.body.Situacao,
    dataEmissao: req.body.DataEmissao,
    dataVencimento: req.body.DataVencimento,
    codigoBarras: req.body.CodBarras,
    Observacao: req.body.Observacao,
    Descricao: req.body.Descricao
}

new Conta(novaConta).save().then(function(){
res.redirect('/contacadastrada');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar conta." );
});

});

router.get("/contacadastrada", function(req,res){
res.render('../public/contacadastrada')
});

//Consultar 
router.get('/consultarcontas', conConta, function(req,res){
    Conta.find().sort({codConta: 'asc'}).then((conta) =>{
       res.render('../public/consultarcontas', {conta: conta});
       }).catch((erro) => {
           console.log(erro);
           req.flash("error_msg","Erro ao consultar contas.");
       }); 
   });
   router.get('/consultarcontas/:busca',conConta, function(req,res){
    if(!isNaN(req.params.busca)){    
        Conta.find({codConta: req.params.busca}).sort({codConta: 'desc'}).then((conta) =>{
        res.render('../public/consultarcontas', {conta: conta});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar a conta. Erro:");
        });
        }
    else{
        Conta.find({nomeFornecedor: new RegExp(req.params.busca, "i")}).sort({nomeFornecedor: 'asc'}).then((conta) =>{
            res.render('../public/consultarcontas', {conta: conta});
            }).catch((erro) => {
                console.log(erro);
                req.flash("error_msg","Erro ao consultar a conta. Erro:");
            });
        } 
   });
//Deletar
router.get("/deletarcontas/:id", delConta, function(req,res){
    Conta.findOneAndDelete({_id : req.params.id}).then((conta) =>{
        req.flash("success_msg","Conta deletada. ");
        res.redirect('/consultarcontas');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Conta não encontrada.");
    })
});
//Editar
router.get("/editarcontas/:id", editConta, function(req,res){
    Conta.findOne({_id: req.params.id}).then((conta) =>{

    res.render('../public/editarcontas', {conta: conta});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Conta não encontrada.");
        res.redirect("/consultarcontas");
    });
});

router.post("/contaedicao", function(req,res){
    Conta.findOne({codConta: req.body.CodConta}).then((conta)=>{
        
        conta.tipoConta = req.body.tipoConta
        conta.codConta = req.body.CodConta
        conta.valConta = req.body.ValConta
        conta.nomeFornecedor = req.body.NomeFornecedor
        conta.Situacao = req.body.Situacao
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
            console.log(erro);
            req.flash("error_msg","Conta não editado.");
            res.redirect("/consultarcontas");
        })
    })
});

//Simulacao
router.get("/simulacao", function(req,res){
    Conta.find().sort({codConta: 'asc'}).then((conta) =>{
        Contabancaria.find({SituacaoContaBanc: "Ativa."}).sort({codContaBanc: 'asc'}).then((contabancaria) =>{
        res.render('../public/simulacao', {conta: conta,contabancaria: contabancaria});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas bancarias.");
        }); 
});


//Arquivo remessa + retorno
router.get("/pagarconta", function(req,res){
    Conta.find().sort({codConta: 'asc'}).then((conta)=>{
    res.render('../public/pagarconta',{conta: conta});
    }).catch((erro)=>{
        console.log(erro);
        req.flash("error_msg","Erro ao pagar conta");
    });
});

//Relatorios
router.get("/relatorio", function(req,res){
    res.render('../public/relatorio');
});

router.get("/relatorio/:busca",function(req,res){
    
    console.log(req.params.busca);
    var Params = new Array;
    Params = req.params.busca;
    Params = Params.replace(/[.]/g, ",");
    var Search = Params.split("+");

    var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 
        
    console.log(Search[0]);
    console.log(Search[1]);
    console.log(Search[2]);

    if(Search[1]!="" || Search[2]!=""){
    Conta.find({Situacao: new RegExp(Search[0],"i"),
      //  dataEmissao:{$gte: new Date(Search[1]),$lte: new Date(Search[2])},
      //  dataVencimento: {$gte: new Date(Search[3]),$lte: new Date(Search[4])},
      //  valConta: new RegExp({"$gte": new Date(),"$lte": new Date(2020, 12, 22)},"i")       
}).sort({[Search[1]]:Search[2]}).then((conta)=>{
    console.log(conta);
        res.render('../public/relatorio',{conta: conta});
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }
    else{
        res.render('../public/relatorio');
    }
});

module.exports = router