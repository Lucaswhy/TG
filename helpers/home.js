module.exports = { 


    home: function (req,res,next){

        if(req.isAuthenticated() && req.user.isAdmin == true){
            return next();
        }

        if(req.isAuthenticated()){
        res.redirect("/homeusuario");
        }
    
        else{
        req.flash("error_msg","Realize um login primeiro.");
        res.redirect("/");
        }
    }

    
}