const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Agencias = new Schema({
    
    nomeBanco: {
        type: Schema.Types.ObjectId,
        ref: "banco",
        required: true
    },

    codAgencia: {
        type: Number,
        required: true,
        unique: true
    },

    numAgencia: {
        type: Number,
        required: true,
        unique: true
    },

    gerAgencia: {
        type: String,
        required: true,
        unique: true
    },

    telAgencia: {
        type: String,
        required: true,
        unique: true
    },

    cepAgencia: {
        type: String,
        required: true,
    },

    endAgencia: {
        type: String,
        required: true,
    },

    cidadeAgencia: {
        type: String,
        required: true,
    },

    estadoAgencia: {
        type: String,
        required: true,
    },

});

mongoose.model("agencia", Agencias);