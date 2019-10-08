const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bancos  = new Schema({
    
    codBanco: {
        type: Number,
        required: true
    },
    
    numeroConta: {
        type: String,
        required: true
    },

    Digito: {
        type: String,
        required: true,
    },

    codAgencia: {
        type: Number,   
        required: true
    },

    nomeAgencia: {
        type: String,
        required: true
    },

    gerenteAgencia: {
        type: String,
        required: true
    },

    Logradouro: {
        type: String,
        required: true
    },

    nBanco: {
        type: String,
        required: true
    },

    numeroAgencia: {
        type: Number,
        required: true
    },

    Tipo: {
        type: String,
        required: true
    },


});

mongoose.model("banco", Bancos)