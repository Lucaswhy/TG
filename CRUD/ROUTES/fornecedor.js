const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Fornecedores"); 
const Fornecedor = mongoose.model('fornecedor');

//Cadastrar Fornecedor boyz
router.get("/cadastrarfornecedor", function(req,res){
    res.render('../public/cadastrarfornecedor');
});

router.post("/validafornecedor", function(req,res){

    const novoFornecedor = {
    codFornecedor: req.body.CodFornecedor,
    RazaoSocial: req.body.RazaoSocial,
    CNPJ: req.body.CPFn,
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
res.redirect('/fornecedorcadastrado');
}).catch(function(erro){
    req.flash("error_msg", "Erro ao cadastrar fornecedor. Erro:" + erro);
});

});

router.get("/fornecedorcadastrado", function(req,res){
res.render('../public/fornecedorcadastrado')
});

//Consultar Boyzzzzzzzzzzzzzzzz
router.get('/consultarfornecedor', function(req,res){
    Fornecedor.find().sort({codFornecedor: 'asc'}).then((fornecedor) =>{
       res.render('../public/consultarfornecedor', {fornecedor: fornecedor});
       }).catch((erro) => {
           req.flash("error_msg","Erro ao consultar fornecedores. Erro:");
       }); 
   });
//Deletar Boyzzzzzzzzzzzzzzzzzz
router.get("/deletarfornecedor/:id", function(req,res){
    Fornecedor.findOneAndDelete({_id : req.params.id}).then((fornecedor) =>{
        req.flash("success_msg","Fornecedor deletado. ");
        res.redirect('/consultarfornecedor');
         }).catch((erro) =>{
        req.flash("error_msg","Fornecedor não encontrado. Erro:" + erro);
    })
});
//Editar BOOOOOOOOOOOOOOOOOOOOOOOOOYZZZZZZZZZZ

router.get("/editarfornecedor/:id", function(req,res){
    Fornecedor.findOne({_id: req.params.id}).then((fornecedor) =>{
    res.render('../public/editarfornecedor', {fornecedor: fornecedor});
    }).catch((erro) =>{
        req.flash("error_msg", "Fornecedor não encontrado. Erro: " + erro);
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
            req.flash("error_msg" + "Fornecedor não editado. Erro: ");
            res.redirect("/consultarfornecedor");
        })
    })
});


module.exports = router