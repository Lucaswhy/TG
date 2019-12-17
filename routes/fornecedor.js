const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Fornecedores"); 
const Fornecedor = mongoose.model('fornecedor');
const {cadForn} = require("../helpers/cadForn");
const {conForn} = require("../helpers/conForn");
const {delForn} = require("../helpers/delForn");
const {editForn} = require("../helpers/editForn");
//FUNCOES GLOBAIS
function validarCNPJ(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}

//Cadastrar Fornecedor
router.get("/cadastrarfornecedor", cadForn, function(req,res){
    res.render('../public/cadastrarfornecedor');
});

router.post("/cadastrarfornecedor", function(req,res){

    const novoFornecedor = {
    codFornecedor: req.body.CodFornecedor,
    RazaoSocial: req.body.RazaoSocial,
    CNPJ: req.body.CNPJ,
    Email: req.body.Email,
    Telefone: req.body.Telefone,
    Endereco: req.body.Endereco,
    CEP: req.body.CEP,
    Numero: req.body.Numero,
    Bairro: req.body.Bairro,
    Cidade: req.body.Cidade,
    Estado: req.body.Estado
}

new Fornecedor(novoFornecedor).save().then(function(){
    req.flash("success_msg", "Fornecedor cadastrado com sucesso!");
    res.redirect("/consultarfornecedor");
}).catch(function(erro){
    console.log(erro);
    req.flash("error_msg", "Erro ao cadastrar fornecedor.");
    res.redirect("/cadastrarfornecedor");
    });

});

router.get("/fornecedorcadastrado", function(req,res){
res.render('../public/fornecedorcadastrado');
});

//Consultar Fornecedor
router.get('/consultarfornecedor', conForn, function(req,res){
    Fornecedor.find().sort({codFornecedor: 'asc'}).then((fornecedor) =>{
       res.render('../public/consultarfornecedor', {fornecedor: fornecedor});
       }).catch((erro) => {
            console.log(erro);
           req.flash("error_msg","Erro ao consultar fornecedores.");
       }); 
   });
router.get('/consultarfornecedor/:busca',conForn, function(req,res){
    if(!isNaN(req.params.busca)){    
        Fornecedor.find({codFornecedor: req.params.busca}).sort({codFornecedor: 'desc'}).then((fornecedor) =>{
        res.render('../public/consultarfornecedor', {fornecedor: fornecedor});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg","Erro ao consultar os fornecedores. Erro:");
        });
        }
    else{
        Fornecedor.find({RazaoSocial: new RegExp(req.params.busca, "i")}).sort({RazaoSocial: 'asc'}).then((fornecedor) =>{
            res.render('../public/consultarfornecedor', {fornecedor: fornecedor});
            }).catch((erro) => {
                console.log(erro);
                req.flash("error_msg","Erro ao consultar os fornecedores. Erro:");
            });
        } 
   });
//Deletar Fornecedor
router.get("/deletarfornecedor/:id", delForn, function(req,res){
    Fornecedor.findOneAndDelete({_id : req.params.id}).then(() =>{
        req.flash("success_msg","Fornecedor deletado. ");
        res.redirect('/consultarfornecedor');
         }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg","Fornecedor não encontrado.");
    })
});
//Editar Fornecedor

router.get("/editarfornecedor/:id", editForn, function(req,res){
    Fornecedor.findOne({_id: req.params.id}).then((fornecedor) =>{

    res.render('../public/editarfornecedor', {fornecedor: fornecedor});
    }).catch((erro) =>{
        console.log(erro);
        req.flash("error_msg", "Fornecedor não encontrado.");
        res.redirect("/consultarfornecedor");
    });
});

router.post("/fornecedoredicao", function(req,res){
    Fornecedor.findOne({codFornecedor: req.body.codFornecedor}).then((fornecedor)=>{
        
        fornecedor.codFornecedor = req.body.codFornecedor
        fornecedor.RazaoSocial = req.body.RazaoSocial
        fornecedor.CNPJ = req.body.CNPJ
        fornecedor.Email = req.body.Email
        fornecedor.Telefone = req.body.Telefone
        fornecedor.Endereco = req.body.Endereco
        fornecedor.CEP = req.body.CEP
        fornecedor.Numero = req.body.Numero
        fornecedor.Bairro = req.body.Bairro
        fornecedor.Cidade = req.body.Cidade
        fornecedor.Estado = req.body.Estado
    
        fornecedor.save().then(() => {
            req.flash("success_msg","Fornecedor editado com sucesso!");
            res.redirect("/consultarfornecedor");
        }).catch((erro) =>{
            console.log(erro);
            req.flash("error_msg","Fornecedor não editado.");
            res.redirect("/consultarfornecedor");
        })
    })
});


module.exports = router