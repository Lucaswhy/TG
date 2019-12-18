const moment = require('moment');
const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Contas"); 
const Conta = mongoose.model('conta');

require("../models/Contabancaria"); 
const Contabancaria = mongoose.model('contabancaria');

require("../models/TipoConta"); 
const TipoConta = mongoose.model('tipoconta');

const {cadConta} = require("../helpers/cadConta");
const {conConta} = require("../helpers/conConta");
const {delConta} = require("../helpers/delConta");
const {editConta} = require("../helpers/editConta");
const {editContaTipo} = require("../helpers/editContaTipo");
const {pagConta} = require("../helpers/pagConta");
const {gerarSim} = require("../helpers/gerarSim");
const {emtRelatorio} = require("../helpers/emtRelatorio");
const {gerRemessa} = require("../helpers/gerRemessa");
const {conRetorno} = require("../helpers/conRetorno");

var fs = require('fs');

router.get("/Conta", cadConta, function(req,res){
    TipoConta.find().sort({codTipoConta: 'asc'}).then((tipoconta) =>{
    res.render('../public/Conta',{tipoconta: tipoconta});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os tipos de conta.");
        res.redirect('/Conta');
    }); 
});

router.get("/cadastrarcontas/", cadConta, function(req,res){
    res.render('../public/cadastrarcontas');
});

router.get("/cadastrarcontasTipo/:tipo", cadConta, function(req,res){
    TipoConta.findOne({nomeTipoConta: req.params.tipo}).then((tipoconta) =>{
    res.render('../public/cadastrarcontasTipo', {tipoconta: tipoconta});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os tipos de conta.");
        res.redirect('/Conta');
    }); 
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
    Descricao: req.body.Descricao,
    tipoConta: req.body.tipoConta
}

new Conta(novaConta).save().then(function(){
    req.flash("success_msg","Conta cadastrada com sucesso. ");
    res.redirect('/consultarcontas');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar conta." );
    res.redirect('/consultarcontas');
});

});

router.post("/validatipocontas", function(req,res){

    if(req.body.cadMulta == "on"){
        var cadMulta = true;
    }

    if(req.body.cadDesconto == "on"){
        var cadDesconto = true;
    }

    if(req.body.cadJuros == "on"){
        var cadJuros = true;
    }

    if(req.body.cadBarras == "on"){
        var cadBarras = true;
    }

    if(req.body.cadDescricao == "on"){
        var cadDescricao = true;
    }

    if(req.body.cadObservacao == "on"){
        var cadObservacao = true;
    }

    const novaTipoConta = {
    
    codTipoConta: req.body.CodTipoConta,
    nomeTipoConta: req.body.nomeTipoConta,
    Multa: cadMulta,
    Desconto: cadDesconto,
    Juros: cadJuros,
    codigoBarras: cadBarras,
    Descricao: cadDescricao,
    Observacao: cadObservacao
    
}

new TipoConta(novaTipoConta).save().then(function(){
    req.flash("success_msg","Tipo de conta cadastrado com sucesso. ");
    res.redirect('/Conta');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar tipo de conta." );
    res.redirect('/Conta');
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
           res.redirect('/consultarcontas');
       }); 
   });
   router.get('/consultarcontas/:busca',conConta, function(req,res){
    if(!isNaN(req.params.busca)){    
        Conta.find({codConta: req.params.busca}).sort({codConta: 'desc'}).then((conta) =>{
        res.render('../public/consultarcontas', {conta: conta});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar a conta. Erro:");
            res.redirect('/consultarcontas');
        });
        }
    else{
        Conta.find({nomeFornecedor: new RegExp(req.params.busca, "i")}).sort({nomeFornecedor: 'asc'}).then((conta) =>{
            res.render('../public/consultarcontas', {conta: conta});
            }).catch((erro) => {
                console.log(erro);
                req.flash("error_msg","Erro ao consultar a conta. Erro:");
                res.redirect('/consultarcontas');
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
        res.redirect('/consultarcontas');
    })
});

router.get("/deletarcontastipo/:id", delConta, function(req,res){
    TipoConta.findOneAndDelete({_id : req.params.id}).then(() =>{
        req.flash("success_msg","Tipo de conta deletada. ");
        res.redirect('/Conta');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Tipo de conta não encontrada.");
        res.redirect('/Conta');
    })
});


//Editar
router.get("/editarcontas/:id", editConta, function(req,res){
    Conta.findOne({_id: req.params.id}).then((conta) =>{
        TipoConta.findOne({nomeTipoConta: conta.tipoConta}).then((tipoconta) =>{
           TipoConta.find().then((alltipoconta) =>{ 
    res.render('../public/editarcontas', {conta: conta,tipoconta: tipoconta,alltipoconta: alltipoconta});
}).catch((erro) =>{
    console.log(erro);
    req.flash("error_msg", "Conta não encontrada.");
    res.redirect("/consultarcontas");
});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Problema ao consultar o tipo de contas. Contate o Administrador.");
        res.redirect("/consultarcontas");
    })
    }).catch((erro) =>{
    console.log(erro);
    req.flash("error_msg", "Problema ao consultar o tipo de contas. Contate o Administrador.");
    res.redirect("/consultarcontas");
});
});

router.post("/contaedicao",editConta, function(req,res){
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
        conta.tipoConta = req.body.tipoConta
    
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

router.get("/editarcontastipo/:elementos", editContaTipo, function(req,res){

    var Params = new Array;
    Params = req.params.elementos;
    var Elementos = Params.split("+");
//http://localhost:8081/editarcontastipo/5df6b384681d9e236466bc0a+Valor+true+true+true+true+false+false
    TipoConta.findOne({_id: Elementos[0]}).then((tipoconta)=>{
        
        tipoconta.nomeTipoConta = Elementos[1]
        tipoconta.Multa = Elementos[2]
        tipoconta.Desconto = Elementos[3]
        tipoconta.Juros = Elementos[4]
        tipoconta.codigoBarras = Elementos[5]
        tipoconta.Descricao = Elementos[6]
        tipoconta.Observacao = Elementos[7]
    
        tipoconta.save().then(() => {
            req.flash("success_msg","Tipo de conta editado com sucesso!");
            res.redirect("/Conta");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Tipo de conta não editado.");
            res.redirect("/Conta");
        })
    })
});

//Simulacao
router.get("/simulacao", gerarSim, function(req,res){
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
router.get("/pagarconta", pagConta, function(req,res){
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

//Pagando Avulso

router.get("/validaPagarConta/:id",pagConta, function(req,res){

    var Params = new Array;
    Params = req.params.id;
    var cPagas = Params.split("+");

    var hoje = new Date();
    var dPagamento = moment(hoje).format('MM/DD/YYYY');

    var j = 1;
    for(var i = 0;i<cPagas.length;i++){
    Conta.findOne({_id: cPagas[i]}).then((conta) =>{

        conta.Situacao = "Fechada";
        conta.Pagador = String(req.user.Nome);
        conta.dataPagamento = dPagamento;

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

router.get("/validaPagarContaB/:cb/:id",pagConta, function(req,res){
    
    
    var Params = new Array;
    Params = req.params.id;
    var cPagas = Params.split("+");

    var Params2 = new Array;
    Params2 = req.params.cb;
    var cbank = Params2.split("+");

    var array = cbank[1].split(".");
    var cent = parseFloat(array[1]);

    var hoje = new Date();
    var dPagamento = moment(hoje).format('MM/DD/YYYY');

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
        conta.dataPagamento = dPagamento;

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

//Remessa
router.get("/remessa/:banco/:numerobanco/:agencia/:id",gerRemessa, function(req,res){

    var hoje = new Date();
    var count = 1;
    var linhas = 1;
    var i = 0;
    var erroRemessa = 0;

    var today = moment(hoje).format('DDMMYYYY');
    var dd = moment(hoje).format('DD');
    var mm = moment(hoje).format('MM');
    var yyyy = moment(hoje).format('YYYY');
    var dPagamento = moment(hoje).format('MM/DD/YYYY');

    var bank = req.params.banco;
    var bankNumber = req.params.numerobanco;
    var agency = req.params.agencia;

    var Params = new Array;
    Params = req.params.id;
    var registros = Params.split("+");


    try {
        while (fs.existsSync("./remessa/remessa_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
        ".txt")) {
          var count = count+1;
        }
      } catch(err) {
        console.error(err)
      }

      try {
        while (fs.existsSync("./retorno/retorno_SIGCB_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
        ".txt")) {
          var count = count+1;
        }
      } catch(err) {
        console.error(err)
      }

// REMESSA TIPO 0, HEADER
    fs.writeFile("./remessa/remessa_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,//"                                POSIÇÃO                     \n"+
    //"      CAMPO                                            PICTURE           CONTEÚDO          DESCRIÇÃO\n"+
    //"                                      De     Até\n"+
    "01.0 "+ "'0' " + ".txt" + "                     		"+linhas+"         "+linhas+"      "+ "9(001)"+"         "+"'00000000000000000' "+ "        \n"+
    "02.0 "+ count +"  "+ count + "                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'1'       "+ "NE065        \n"+
    "03.0 "+ "remessa_"+dd+"_"+mm+"_"+yyyy+"_"+count+"_ "+count+"      		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(021)"+"         "+"TESTE      "+ "NE001       \n"+
    "04.0 "+ "01 " + count + "                     		        "+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'01'       "+ "NE001        \n"+
   "05.0 " +"COBRANCA " + count + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(008)"+"         "+"COBRANCA       "+ "NE002        \n"+
/* BUSCAR AGÊNCIA */    "06.0 '" +agency+"' " +agency + "'                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(004)"+"         "+agency+ " NE003        \n"+
    "08.0 " + "Ovelha Pneus " + "Ovelha Pneus LTDA me." + " 		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(011)"+"         "+"Ovelha Pneus       "+ "NE005        \n"+
    "10.0 " + "184 " + "184" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(003)"+"         "+"'184'      "+ "NE006        \n"+
/* BUSCAR BANCO */    "11.0 '" + bank +"' '" +  bank + "'   "+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(019)"+"         "+"'Brancos'      "+ " NE007        \n"+
    "012.0 " + dd+mm+yyyy+" "+dd+mm+yyyy+ + "                                    		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+dd+mm+yyyy+"      "+ "NE008        \n"+
    "014.0 " + "0000"+count+ " " + count +  "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(005)"+"         "+"'0000"+count+"'         "+ "NE009        \n"
    /*Código do Registro 01.0
      Código da Remessa    02.0
      Literal da Remessa 03.0  
      Código do serviço 04.0
      Literal de serviço 05.0
      Código da Agência 06.0
      Nome da Empresa 08.0
      Código do Banco 10.0
      Nome do Banco 11.0
      Data de Geração 12.0
      N° Sequencial - A 14.0*/
      ,"UTF-8",function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    });

// http://localhost:8081/remessa/Itau/108/6424/5dee9bd1ce1f16182c0b6622+5dee9ba8ce1f16182c0b6621

async function dadosRemessa() {
for(i=0; i < registros.length; i++){
    
Conta.findOne({_id: registros[i]}).then((conta) =>{


    var dataJuros = moment(conta.dataVencimento).format('DDMMYYYY');
    var dVencimento = moment(conta.dataVencimento).format('DDMMYYYY');
    var dEmissao = moment(conta.dataEmissao).format('DDMMYYYY');

// REMESSA TIPO 1,  DADOS DO TITÚLO

    fs.appendFile("./remessa/remessa_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,
    "01.1 "+ "'1' " + ".txt" + "                     		"+linhas+"         "+linhas+"      "+ "9(001)"+"         "+"'11111111111111111' "+ "        \n"+
    "02.1 "+"'02' " +"CNPJ"+ "                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'2'       "+ "NE011        \n"+
    "03.1 "+"0223233556 "+"02.232.3355-6 "+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(010)"+"         "+"'47.664.293/0001-75'       "+ "NE012        \n"+
    "05.1  "+ "3746 " + "36928-3" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(004)"+"         "+"3746       "+ "NE003        \n"+
    "06.1 " + "'1' " + "Bradesco" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'1'       "+ "NE027        \n"+
    "07.1 " + "'3' " + "E-mail" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'3'       "+ "NE028        \n"+
/*BUSCAR JUROS*/    "09.1" + "'00' " + "'"+conta.Juros+"'                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'00'       "+ "NE013        \n"+
    "12.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(002)"+"         "+"      "+ "       \n"+
    "12A.1 "+ "'1' " + "        "+  "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"      "+ "NE055       \n"+
    "13.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(002)"+"         "+"      "+ "       \n"+
 /*DATA DE JUROS*/   "13A.1 " + dataJuros + " "+dataJuros+"                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         '"+dataJuros+"'     "+ "NE063       \n"+
/*BUSCAR DESCONTO*/    "13B.1 "+ conta.Desconto+ " " + dataJuros +"       "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'1'      "+ "NE061       \n"+
    "13C.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(022)"+"         "+"      "+ "       \n"+
    "14.1 " + "'01' " + "'01'" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'010101010101'       "+ "NE016        \n"+
/*BUSCAR VENCIMENTO*/    "17.1 "+ dVencimento + " "+ dVencimento+"                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         '"+dVencimento +"'      "+ "NE019       \n"+
/*BUSCAR VALORCONTA*/     "18.1 '" + conta.valConta +"' '"+conta.valConta + "'                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         '"+conta.valConta+"'       "+ "NE020        \n"+
/*BUSCAR BANCO*/    "19.1 '" + bankNumber +"' '"+ bank + "'   "+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(003)"+"         '"+ bankNumber + "'      "+ "NE006        \n"+
    "20.1 " + "'0' " + bank + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'00001'       "+ "NE021        \n"+
    "22.1 " + "'A' " + "Aceito"+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'A'       "+ "NE023        \n"+
/*BUSCAR DATA DE EMISSAO */  "23.1 "+ dEmissao +" " + dEmissao+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         '"+dEmissao +"'       "+ "NE056        \n"+
 /*BUSCAR JUROS*/   "26.1 '" + conta.Juros + "' '"+ conta.Juros  + "'                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         '"+conta.Juros+"'       "+ "NE064        \n"+
/*BUSCAR VALOR*/    "28.1 " + "'5' '" + conta.Desconto + "'                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         '"+conta.Desconto+"'       "+ "NE062        \n"+
    "31.1 "+"'02' " +"CNPJ"+ "                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'2'       "+ "NE011        \n"+
    "32.1 "+"0223233556 "+"02.232.3355-6 "+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(010)"+"         "+"'47.664.293/0001-75'       "+ "NE012        \n"+
    "33.1 "+"Ovelha Pneus "+"Ovelha Pneus LTDA me."+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(012)"+"         "+"            "+ "        \n"+
    "34.1 "+"Av. General Carneiro, 377 "+"Av. General Carneiro, 377"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(025)"+"         "+"'1'            "+ "NE058        \n"+
    "35.1 "+"Vila Lucy "+"Vila Lucy"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(009)"+"         "+"Vila Lucy            "+ "NE058        \n"+
    "36.1 "+"18035640 "+"18035-640"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(008)"+"         "+"'18035640'            "+ "NE058        \n"+
    "37.1 "+"Sorocaba "+"Sorocaba"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(008)"+"         "+"Sorocaba            "+ "NE058        \n"+
    "38.1 "+"SP "+"São Paulo"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(008)"+"         "+"SP            "+ "NE058        \n"+
    "39.1 "+today+" "+today+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+today+"            "+ "NE059        \n"+
/*BUSCAR VALOR DA MULTA*/"40.1 '"+conta.Multa+ "' '"+conta.Multa+"'                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(010)"+"         '"+conta.Multa+"'           "+ "       \n"+
    "42.1 "+"'00' "+"Instrução 3"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'00'            "+ "       \n"+
    "44.1 "+"'1' "+"1"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'11111111111111'"+ "       \n"+                
    "45.1 "+"'"+i+"' 00000"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+""+ "       \n"                
    /*Código do Registro 01.1
    /Tipo Inscrição 02.1
    /Número Inscrição 03.1
    /Agência 05.1
    /ID Emissao 06;1
    /ID Postagem 07.1
    /Taxa Permanencia 09.1
    /Brancos 12.1
    /Uso livre banco/empresa 12A.1
    /Brancos 13.1
    Data Juros 13A.1
    Código Desconto 13B.1
    Brancos 13C.1
    Carteira 14.1
    Vencimento 17.1
    Valor do Título 18.1
    Código do Banco 19.1
    Agência 20.1
    Aceite 22.1
    Data Emissao Titulo 23.1
    Juros Mora 26.1
    Valor Percentual do desconto 28.1
    Tipo Inscrição 31.1
    Número Inscrição 32.1
    Nome 33.1
    Endereço 34.1
    Bairro 35.1
    CEP 36.1
    Cidade 37.1
    UF 38.1
    Data da Multa 39.1
    Valor da Multa 40.1
    Instrução 3 42.1
    Código da moeda 44.1
    Número Sequencial 45.1
                    */
                   
    ,"UTF-8",function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
});


    conta.Situacao = "Fechada";
    conta.Pagador = String(req.user.Nome);
    conta.dataPagamento = dPagamento;

    conta.save().then(() => {
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Erro ao salvar o pagamento da conta. Contate o Administrador.");
        res.redirect("/pagarconta");
})
    

 
}).catch((erro) =>{
    console.log(erro);
    erroRemessa = 1;
    req.flash("error_msg","Houve um erro ao consultar as contas. A remessa não será enviada. Contate o Administrador.");
    res.redirect("/pagarconta");
    })

    } 
}

//REMESSA TIPO 9, TRAILER DE REMESSA
async function trailerRemessa(){
    setTimeout( function write(){    
    fs.appendFile("./remessa/remessa_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,  "01.9 "+ "'0' " + ".txt" + "                     		"+linhas+"         "+linhas+"      "+ "9(001)"+"         "+"'999999999999999' "+ "        \n"+
    "02.9 "+"'"+i+"' 00000"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+""+ "       \n"
    
    ,"UTF-8",function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    }, 5000);
    });
}

async function geraRemessa(){
    try{
    await dadosRemessa();
    trailerRemessa();
    } catch(erro) {
        console.log(erro);
    }

}

geraRemessa();

//ARQUIVO RETORNO

var linhas2 = 1;

//RETORNO TIPO 0, HEADER DO RETORNO

    if(erroRemessa != 1){

    fs.writeFile("./retorno/retorno_SIGCB_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,//"                                POSIÇÃO                     \n"+
    //"      CAMPO                                            PICTURE           CONTEÚDO          DESCRIÇÃO\n"+
    //"                                      De     Até\n"+
    "01.0 "+ "'0' " + ".txt" + "                     		"+linhas2+"         "+linhas2+"      "+ "9(001)"+"         "+"'00000000000000000' "+ "        \n"+
    "02.0 "+ count +"  "+ count + "                           		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(002)"+"         "+"'1'       "+ "NE065        \n"+
    "03.0 "+ "retorno_SIGCB"+dd+"_"+mm+"_"+yyyy+"_"+count+"_ "+count+"      		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "X(021)"+"         "+"TESTE      "+ "NE001       \n"+
    "04.0 "+ "01 " + count + "                     		        "+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(002)"+"         "+"'01'       "+ "NE001        \n"+
   "05.0 " +"COBRANCA " + count + "                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "X(008)"+"         "+"COBRANCA       "+ "NE002        \n"+
    "06.0 '" +agency+"' " +agency + "'                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "X(004)"+"         "+agency+ " NE003        \n"+
    "08.0 " + "Ovelha Pneus " + "Ovelha Pneus LTDA me." + " 		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "X(011)"+"         "+"Ovelha Pneus       "+ "NE005        \n"+
    "10.0 " + "184 " + "184" + "                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(003)"+"         "+"'184'      "+ "NE006        \n"+
    "11.0 '" + bank +"' '" +  bank + "'   "+(linhas=(linhas2 + 1))+"         "+linhas2+"      "+ "X(019)"+"         "+"'Brancos'      "+ " NE007        \n"+
    "012.0 " + dd+mm+yyyy+" "+dd+mm+yyyy+ + "                                    		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(006)"+"         "+dd+mm+yyyy+"      "+ "NE008        \n"+
    "014.0 " + "0000"+count+ " " + count +  "                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(005)"+"         "+"'0000"+count+"'         "+ "NE009        \n"
    , function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    });

    for(i=0; i < registros.length; i++){
        fs.appendFile("./retorno/retorno_SIGCB_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
        ".txt" ,"0"+i+".1 "+""+"retorno_SIGCB_"+dd+"_"+mm+"_"+yyyy+"_"+count+"_"+".txt                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "X(020)"+"         "+"OK "+ "        \n"
        ,function(erro) {

            if(erro) {
                console.log(erro);
                throw erro;
            }
        });
    }
    fs.appendFile("./retorno/retorno_SIGCB_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt", "01.9 "+ "'0' " + ".txt" + "                     		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(001)"+"         "+"'999999999999999' "+ "        \n"+
    "02.9 "+"'"+i+"' 00000"+"                           		"+(linhas2=(linhas2 + 1))+"         "+linhas2+"      "+ "9(006)"+"         "+""+ "       \n"

    ,function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    });

    

    req.flash("success_msg","Remessa salvo com sucesso. Atualize a Página para atualizar as contas! ");
    console.log("Arquivo salvo");
    
    res.redirect("/pagarconta");
    }
});

    


//Retorno
router.get("/retorno", conRetorno, function(req,res){
    
const path = require('path');
const directoryPath = path.join(__dirname, '../retorno');
var retorno = new Array;
var i = 0;

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        res.render('../public/home');
        req.flash("error_msg","Erro ao consultar arquivos retornos. Contate o administrador.");
        return console.log('Impossível encontrar o diretório de retornos.  ' + err);
    } 

    

    files.forEach(function (dado) {
        retorno[i] = {
        Nome: dado
        }
        i++;
    });
    res.render('../public/consultarretorno',{retorno: retorno});
});

router.get('/retorno/download/:arquivo', conRetorno, function(req, res){
    var Arquivo = req.params.arquivo;
    const file = `./retorno/`+Arquivo;
    res.download(file); 
  });



});

//Relatorios
router.get("/relatorio", emtRelatorio, function(req,res){
    res.render('../public/relatorio');
});

router.get("/relatorio/:busca",function(req,res){
    
    var Params = new Array;
    Params = req.params.busca;
    var Search = Params.split("+");

    if(Search[0] == ""){
        Search[0] = "NA"
    }

    if(Search[1] == ""){
        Search[1] = "NA"
    }

    if(Search[2] == ""){
        Search[2] = "NA"
    }

    if(Search[3] == ""){
        Search[3] = "02,02,1970"
    }

    if(Search[4] == ""){
        Search[4] = "02,02,2900"
    }

    if(Search[5] == ""){
        Search[5] = "02,02,1970"
    }

    if(Search[6] == ""){
        Search[6] = "02,02,2900"
    }

    if(Search[10]!="" && Search[11]!=""){
    Conta.find({$or: [{Situacao: new RegExp(Search[0],"i")},
    {Situacao: new RegExp(Search[1],"i")},
    {Situacao: new RegExp(Search[2],"i")}],
       dataEmissao:{$gte: new Date(Search[3]),$lte: new Date(Search[4])},
        dataVencimento: {$gte: new Date(Search[5]),$lte: new Date(Search[6])},
        nomeFornecedor: new RegExp(Search[7],"i"),
        valConta: {"$gte": parseFloat(Search[8]),"$lte": parseFloat(Search[9])} 
}).sort({[Search[10]]:Search[11]}).then((conta)=>{
        res.render('../public/relatorio',{conta: conta});
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }
    else{
        Conta.find({$or: [{Situacao: new RegExp(Search[0],"i")},
                    {Situacao: new RegExp(Search[1],"i")},
                    {Situacao: new RegExp(Search[2],"i")}],
       dataEmissao:{$gte: new Date(Search[3]),$lte: new Date(Search[4])},
        dataVencimento: {$gte: new Date(Search[5]),$lte: new Date(Search[6])},
        nomeFornecedor: new RegExp(Search[7],"i"),
        valConta: {"$gte": parseFloat(Search[8]),"$lte": parseFloat(Search[9])}    
    }).sort().then((conta)=>{
        res.render('../public/relatorio',{conta: conta});
    }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar contas.");
        })
    }
});

module.exports = router