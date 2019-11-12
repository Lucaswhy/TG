const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bancos  = new Schema({
    
    codBanco: {
        type: Number,
        required: true,
        unique: true
    },
    
    nomeBanco: {
        type: String,
        required: true,
        unique: true
    },

    CNPJ: {
        type: String,
        required: true,
    },

    numeroBanco: {
        type: Number,
        required: true
    },

    Email: {
        type: String,
        required: true
    },

    Telefone: {
        type: String,
        required: true
    }
});

mongoose.model("banco", Bancos)