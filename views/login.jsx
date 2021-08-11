var React = require('react');
var DefaultLayout = require('./Layout');

function login(props) {

    return (
        <DefaultLayout title={props.title}>
            <div className="login container">
                <p className="login--logo text-center">LOGO</p>
                <div className="row justify-content-center">
                    <div className="login--box col-6">
                        <input type="text" placeholder="Insira seu usuário" className="form-control" />
                        <input type="password" placeholder="Insira sua senha" className="form-control" />
                        <span className="login--forget"><a href="#">Esqueci minha senha</a></span>
                        <button className="btn">Entrar</button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

module.exports = login;