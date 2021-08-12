var React = require('react');
var DefaultLayout = require('./Layout');

function home(props) {
    return (
        <DefaultLayout title={props.title}>
            <div className="jumbotron"> 
                <h1 className="display-4">Bem-Vindo Admin!</h1>
                <hr className="mt-4"/>
                <a className="btn btn-primary btn-lg mb-3" href="/consultarusuario" role="button">Consultar Usuários</a>
                {listAccount(props.conta)}
                <div id="old" class="d-flex flex-wrap wrap">
                    {listUser(props.usuario)}
                </div>
                <div id="new" className="d-flex flex-wrap wrap">
                    {listNewPassword(props.novaSenha)}
                </div>
            </div>
        </DefaultLayout>
    );
}

function listAccount(item){
    console.log(item);
    console.log(Object.entries(item).length);
    if(Object.entries(item).length === 0){
        return (<p className="lead">Nenhuma conta para ser vencida.</p>)
    }
    else{
        let box = [];
        box.push(<p className="lead">Há contas a serem vencidas!</p>);
        item.forEach(i => {
            box.push(<span> Valor: {i.valConta} do Fornecedor: {i.nomeFornecedor} Vencendo hoje: {i.dataVencimento}</span>);   
        })
        return (box)
     }
}

function listUser(item) {
    if(Object.entries(item).length === 0){
        return (<p>Nenhum pedido de usuários para serem liberados.</p>)
    }
    else{
        let box = [];
        box.push(<p>Há usuários para serem liberados!</p>);
        item.forEach(i => {
            box.push(
            <React.Fragment>
            <div class="card mt-4 p-2 mr-2 flex-row ">
            <h4>Cracha: {i.Cracha}</h4>
                   <div class="card-body">
                       <hr/>
                           <p>
                               Usuário: {i.Nome}
                           </p>
                           <div className="form-row flex-column justify-content-end">
                               <a href={`"/liberarcadastro/${i._id}"`}>
                                   <button type="button" className="btn btn-warning">Liberar Cadastro</button>
                               </a>
                               <a href={`"/usuariodeletar/${i._id}"`}>
                                   <button type="button" className="btn btn-danger mt-2">Deletar Usuário</button>
                               </a>
                           </div>
                   </div>
               </div>
            </React.Fragment>
            );
        });
        return (box)    
    }
}

function listNewPassword(item){
    if(Object.entries(item).length === 0){
        return (<p>Nenhuma solicitação de troca de senha foi requerida.</p>)
    }
    else{
        let box = [];
        item.forEach(i => {
            box.push( 
            <React.Fragment>
                <div className="card mt-4 p-2 flex-row ">
                    <div className="card-body">
                        <h4>Cracha: { i.Cracha }</h4>
                        <hr/>
                        <p>
                            Usuário: { i.Nome }
                        </p>
                        <div className="form-row flex-column justify-content-end">
                            <a href={`"/trocarsenha/${i._id}"`}>
                            <button type="button" class="btn btn-danger">Liberar mudança de Senha</button>
                            </a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
            )
        })
        return (box)
    }
}

module.exports = home;