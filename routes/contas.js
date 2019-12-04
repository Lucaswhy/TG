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

var fs = require('fs');

router.get("/Conta", cadConta, function(req,res){
    TipoConta.find().sort({codTipoConta: 'asc'}).then((tipoconta) =>{
    res.render('../public/Conta',{tipoconta: tipoconta});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os tipos de conta.");
    }); 
});

router.get("/cadastrarcontas/", cadConta, function(req,res){
    res.render('../public/cadastrarcontas');
});

router.get("/cadastrarcontasTipo/:tipo", function(req,res){
    TipoConta.findOne({nomeTipoConta: req.params.tipo}).then((tipoconta) =>{
    res.render('../public/cadastrarcontasTipo', {tipoconta: tipoconta});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg","Erro ao consultar os tipos de conta.");
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
    Descricao: req.body.Descricao
}

new Conta(novaConta).save().then(function(){
res.redirect('/contacadastrada');
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar conta." );
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

router.get("/deletarcontastipo/:id", delConta, function(req,res){
    TipoConta.findOneAndDelete({_id : req.params.id}).then((tipoconta) =>{
        req.flash("success_msg","Tipo de conta deletada. ");
        res.redirect('/Conta');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Tipo de conta não encontrada.");
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

router.get("/editarcontastipo/:elementos", function(req,res){

    var Params = new Array;
    Params = req.params.elementos;
    var Elementos = Params.split("+");
//http://localhost:8081/editarcontastipo/5de55d0f6d85953efc7a5980+Valor+true+true+true+true+true+true
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

//Pagando Avulso

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

//Remessa
router.get("/remessa", function(req,res){
    
    var today = new Date();
    var dd = today.getDay();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    var count = 1;
    var linhas = 1;

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
/* BUSCAR AGÊNCIA */    "06.0 " + "3746 " + "36928-3" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(004)"+"         "+"3746       "+ "NE003        \n"+
    "08.0 " + "Ovelha Pneus " + "Ovelha Pneus LTDA me." + " 		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(011)"+"         "+"Ovelha Pneus       "+ "NE005        \n"+
    "10.0 " + "184 " + "184" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(003)"+"         "+"'184'      "+ "NE006        \n"+
/* BUSCAR BANCO */    "11.0 " + "Banco Itaú BBA S.A. " + "Banco Itaú BBA S.A. " + "   "+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(019)"+"         "+"'Brancos'      "+ "NE007        \n"+
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
// REMESSA TIPO 1,  DADOS DO TITÚLO
    fs.appendFile("./remessa/remessa_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,
    "01.1 "+ "'1' " + ".txt" + "                     		"+linhas+"         "+linhas+"      "+ "9(001)"+"         "+"'11111111111111111' "+ "        \n"+
    "02.1 "+"'02' " +"CNPJ"+ "                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'2'       "+ "NE011        \n"+
    "03.1 "+"0223233556 "+"02.232.3355-6 "+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(010)"+"         "+"'47.664.293/0001-75'       "+ "NE012        \n"+
    "05.1  "+ "3746 " + "36928-3" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(004)"+"         "+"3746       "+ "NE003        \n"+
    "06.1 " + "'1' " + "Bradesco" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'1'       "+ "NE027        \n"+
    "07.1 " + "'3' " + "E-mail" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'3'       "+ "NE028        \n"+
/*BUSCAR JUROS*/    "09.1" + "'00' " + "'0.75'"  + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'00'       "+ "NE013        \n"+
    "12.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(002)"+"         "+"      "+ "       \n"+
    "12A.1 "+ "'1' " + "        "+  "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"      "+ "NE055       \n"+
    "13.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(002)"+"         "+"      "+ "       \n"+
 /*DATA DE JUROS*/   "13A.1 " + dd+"_"+mm+"_"+yyyy+" "+ dd+"_"+mm+"_"+yyyy+"                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+"DDMMAAAA      "+ "NE063       \n"+
/*BUSCAR DESCONTO*/    "13B.1 "+ "'1'" + "DDMMAAAA       "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'1'      "+ "NE061       \n"+
    "13C.1 " + "  " + "         "+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(022)"+"         "+"      "+ "       \n"+
    "14.1 " + "'01' " + "'01'" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'010101010101'       "+ "NE016        \n"+
/*BUSCAR VENCIMENTO*/    "17.1 "+ dd+"_"+mm+"_"+yyyy+" "+ dd+"_"+mm+"_"+yyyy+"                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+"DDMMAAAA      "+ "NE019       \n"+
/*BUSCAR VALORCONTA*/     "18.1 " + "'200.00' " + "'200.00" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         "+"'200.00'       "+ "NE020        \n"+
/*BUSCAR BANCO*/    "19.1 " + "'104' " + "CAIXA ECONOMICA FEDERAL " + "   "+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(003)"+"         "+"'104'      "+ "NE006        \n"+
    "20.1 " + "'0' " + "CAIXA" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'00001'       "+ "NE021        \n"+
    "22.1 " + "'A' " + "Aceito"+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(001)"+"         "+"'A'       "+ "NE023        \n"+
/*BUSCAR DATA DE EMISSAO */  "23.1 "+ "DDMMAAAA" + "DDMMAAAA"+ "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(006)"+"         "+"'DDMMAAAA'       "+ "NE056        \n"+
 /*BUSCAR JUROS*/   "26.1 " + "'0.75' " + "0.75"  + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         "+"'''0.75'''       "+ "NE064        \n"+
/*BUSCAR VALOR*/    "28.1 " + "'2' " + "'%15" + "                     		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(013)"+"         "+"'15'       "+ "NE062        \n"+
    "31.1 "+"'02' " +"CNPJ"+ "                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(002)"+"         "+"'2'       "+ "NE011        \n"+
    "32.1 "+"0223233556 "+"02.232.3355-6 "+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(010)"+"         "+"'47.664.293/0001-75'       "+ "NE012        \n"+
    "33.1 "+"Ovelha Pneus"+"Ovelha Pneus LTDA me."+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(012)"+"         "+"            "+ "        \n"+
    "34.1"+"Av. General Carneiro, 377"+"Av. General Carneiro, 377"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(025)"+"         "+"'1'            "+ "NE058        \n"+
    "35.1"+"Vila Lucy"+"Vila Lucy"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "X(009)"+"         "+"Vila Lucy            "+ "NE058        \n"+
    "36.1"+"18035640"+"18035-640"+"                           		"+(linhas=(linhas + 1))+"         "+linhas+"      "+ "9(008)"+"         "+"'18035640'            "+ "NE058        \n"+
    ""
    //Código do Registro 01.1
    //Tipo Inscrição 02.1
    //Número Inscrição 03.1
    //Agência 05.1
    //ID Emissao 06;1
    //ID Postagem 07.1
    //Taxa Permanencia 09.1
    //Brancos 12.1

    ,"UTF-8",function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    });
//REMESSA TIPO 9, TRAILER DE REMESSA


//ARQUIVO RETORNO

//RETORNO TIPO 0, HEADER DO RETORNO

    fs.writeFile("./retorno/retorno_SIGCB_" +dd+"_"+mm+"_"+yyyy+"_"+count+"_"+
    ".txt" ,"Retorno teste", function(erro) {

        if(erro) {
            console.log(erro);
            throw erro;
        }
    });  

    req.flash("success_msg","Remessa salvo com sucesso ");
    console.log("Arquivo salvo");
    
    res.redirect("/pagarconta");
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