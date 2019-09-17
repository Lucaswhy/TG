const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

require("../models/Usuario");
const Usuario = mongoose.model("usuario");


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: "Email"}, (email, senha, done) => {

        Usuario.findOne({Email: email}).then((usuario)=> {
            if(usuario){
                return done(null,false,{message: "Esta conta não existe."});
            }
        });
            if(usuario.LoginStatus == false ){
                return done(null,false,{message: "Esta conta ainda não foi liberada pelo administrador."});
            }


            if(usuario.Senha == senha){
                    return done(null,user);
            }
            else{
                return done(null, false,{message: "Senha incorreta."})
            }   
        

    }));

    passport.serializeUser((user,done)=>{
        done(null,usuario.id);
    });

    passport.deserializeUser((id, done) =>{
        User.findById(id,(err,usuario)=>{
            done(err,user);
        });
    });

}