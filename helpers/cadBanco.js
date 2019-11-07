module.exports = { 


    cadBanco: function (req,res,next){

        if(req.isAuthenticated() && (req.user.cadBanco == true || req.user.isAdmin == true)){
            return next();
        }

        if(req.isAuthenticated()){
        req.flash("error_msg","Você não tem permissão para acessar esta página.");
        res.redirect("/homeUsuario");
        }

        else{
        req.flash("error_msg","Realize um login primeiro.");
        res.redirect("/");
        }
    }
    
}