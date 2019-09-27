const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

require("../models/Usuario");
const Usuario = mongoose.model("usuario");


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: "Email", passwordField:"Senha"}, (email, senha, done) => {

        Usuario.findOne({Email: email}).then((usuario)=> {
            if(!usuario){
                return done(null,false,{message: "Esta conta não existe."});
            }

            if(usuario.LoginStatus == false){
                return done(null,false,{message: "Esta conta ainda não foi liberada pelo Administrador."});
            }

            if(usuario.Senha == senha){
                return done(null,usuario);
            
            }
            else{
            return done(null, false,{message: "Senha incorreta."})
            }   
    

        });

    }));

    passport.serializeUser((usuario,done)=>{
        console.log('Serializando usuario: ');console.log(usuario.Nome);
        done(null, usuario);
    });

    passport.deserializeUser((usuario, done) =>{
        Usuario.find({usuario: usuario},(err, user)=>{
        console.log('Deserializando usuario: ');console.log(usuario.Nome);
        done(err,usuario);
        });
    
    })       

}