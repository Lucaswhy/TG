const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Contabancaria  = new Schema({
    
    codContaBanc: {
        type: Number,
        required: true,
        unique: true
    },
    
    numeroContaBanc: {
        type: Number,
        required: true,
        unique: true
    },

    Digito: {
        type: Number,
        required: true,
    },

    Saldo: {
        type: String,   
        required: true
    },

    SituacaoContaBanc: {
        type: String,
        required: true
    },

    DataAbertura: {
        type: String,
        required: true
    },

    Titular: {
        type: String,
        required: true
    },

    Agencia: {
        type: Schema.Types.ObjectId,
        ref: "agencia",
        required: true
    }

});

mongoose.model("contabancaria", Contabancaria)