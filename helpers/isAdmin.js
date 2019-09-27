module.exports = { 


    isAdmin: function (req,res,next){

        if(req.isAuthenticated() && req.user.isAdmin == true){
            return next();
        }

        if(req.isAuthenticated()){
        req.flash("error_msg","Apenas administradores tem permissão para entrar nesta página.");
        res.redirect("/cadastrarcontas");
        }
    
        else{
        req.flash("error_msg","Realize um login primeiro.");
        res.redirect("/");
        }
    }

    
}