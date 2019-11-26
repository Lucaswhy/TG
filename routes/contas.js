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
        Contabancaria.find({SituacaoContaBanc: "Ativa"}).populate({path: "Agencia",populate:{path: "Banco"}}).sort({codContaBanc: 'asc'}).then((contabancaria) =>{
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


//Arquivo remessa + Pagar avulso
router.get("/pagarconta", function(req,res){
    Conta.find({Situacao: "Aberta"}).sort({codConta: 'asc'}).then((conta)=>{
        Contabancaria.find({SituacaoContaBanc: "Ativa"}).populate({path: "Agencia",populate:{path: "Banco"}}).sort({codContaBanc: 'asc'}).then((contabancaria) =>{
    res.render('../public/pagarconta',{conta: conta,contabancaria: contabancaria});
    }).catch((erro)=>{
        console.log(erro);
        req.flash("error_msg","Erro ao consultar conta(s).");
    })}).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar conta(s) bancaria(s).");
    }); 
});

router.get("/validaPagarConta/:id", function(req,res){

    var Params = new Array;
    Params = req.params.id;
    var cPagas = Params.split("+");
    var j = 1;
    for(var i = 0;i<cPagas.length;i++){
    Conta.findOne({_id: cPagas[i]}).then((conta) =>{

        conta.Situacao = "Fechada";
        conta.Pagador = String(req.user.Nome);

        conta.save().then(() => {
            j = 1;
        }).catch((erro) =>{
            console.log(erro);
            i = cPagas.length;
            j = 0;
            req.flash("error_msg","Erro ao salvar o pagamento da conta. Contate o Administrador.");
            res.redirect("/pagarconta");
        })

        }).catch((erro) =>{
            console.log(erro);
            i = cPagas.length;
            j = 0;
        });
    }
    if(j == 0){
    req.flash("error_msg", "Houve um problema no pagamento.");
    res.redirect("/pagarconta");
    }

    else{
        req.flash("success_msg","Conta(s) paga(s) com sucesso!");
        res.redirect("/pagarconta");
    }
});

router.get("/validaPagarContaB/:cb/:id", function(req,res){
    
    var Params = new Array;
    Params = req.params.id;
    var cPagas = Params.split("+");

    var Params2 = new Array;
    Params2 = req.params.cb;
    var cbank = Params2.split("+");

    var array = cbank[1].split(".");
    var cent = parseFloat(array[1]);

    if(isNaN(cent) == true){
        cent = 0;
    }

    cent = cent/100;
    var val = parseFloat(array[0].replace(/[.,R$]/g, ""));
    var vTotal = 0;
    vTotal = vTotal + val + cent;

    var j = 1;

    for(var i = 0;i<cPagas.length;i++){
    Conta.findOne({_id: cPagas[i]}).then((conta) =>{

        conta.Situacao = "Fechada";
        conta.Pagador = String(req.user.Nome);

        conta.save().then(() => {
            j = 1;
        }).catch((erro) =>{
            console.log(erro);
            i = cPagas.length;
            j = 0;
            req.flash("error_msg","Erro ao salvar o pagamento da conta. Contate o Administrador.");
            res.redirect("/pagarconta");
        })

        }).catch((erro) =>{
            console.log(erro);
            i = cPagas.length;
            j = 0;
        });
    }
    if(j == 0){
    req.flash("error_msg", "Houve um problema no pagamento.");
    res.redirect("/pagarconta");
    }

    else{

        Contabancaria.findOne({_id: cbank[0]}).then((contabancaria) =>{
            
            var vSaldo = contabancaria.Saldo;
            vSaldo = vSaldo - vTotal;
            contabancaria.Saldo = vSaldo;     
            
            contabancaria.save().then(() => {
                j = 1;
            }).catch((erro) =>{
                console.log(erro);
                req.flash("error_msg","Erro ao  descontar o pagamento da conta bancaria. Contate o Administrador.");
                res.redirect("/pagarconta");
            })

        })

        req.flash("success_msg","Conta(s) paga(s) com sucesso!");
        res.redirect("/pagarconta");
    }



});

//Retorno
router.get("/retorno", function(req,res){
    res.render('../public/consultarretorno');
});

//Relatorios
router.get("/relatorio", function(req,res){
    res.render('../public/relatorio');
});

router.get("/relatorio/:busca",function(req,res){
    
    var Params = new Array;
    Params = req.params.busca;
    Params = Params.replace(/[.]/g, ",");
    var Search = Params.split("+");        

    if(Search[8]!="" || Search[9]!=""){
    Conta.find({Situacao: new RegExp(Search[0],"i"),
       dataEmissao:{$gte: new Date(Search[1]),$lte: new Date(Search[2])},
        dataVencimento: {$gte: new Date(Search[3]),$lte: new Date(Search[4])},
        nomeFornecedor: new RegExp(Search[5],"i")
      //  valConta: new RegExp({"$gte": new Date(),"$lte": new Date(2020, 12, 22)},"i")       
}).sort({[Search[8]]:Search[9]}).then((conta)=>{
    console.log(conta);
        res.render('../public/relatorio',{conta: conta});
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }
    else{
        Conta.find({Situacao: new RegExp(Search[0],"i"),
       dataEmissao:{$gte: new Date(Search[1]),$lte: new Date(Search[2])},
        dataVencimento: {$gte: new Date(Search[3]),$lte: new Date(Search[4])},
        nomeFornecedor: new RegExp(Search[5],"i")
      //  valConta: new RegExp({"$gte": new Date(),"$lte": new Date(2020, 12, 22)},"i")       
    }).sort().then((conta)=>{
    console.log(conta);
        res.render('../public/relatorio',{conta: conta});
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }
});

module.exports = router