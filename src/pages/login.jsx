import React from 'react';

export default class Login extends React.Component{
  state = {
    username: '',
    password: ''
  }

  async onSubmit(e){
    e.preventDefault();
    window.dispatchEvent(new Event('_startload'));

    let loginResponse = await window.factory.login(this.state.username, this.state.password);

    if(loginResponse === true){
      window.dispatchEvent(new Event('_loginchange'));
    }else{
      window.dispatchEvent(new CustomEvent('_showalert', { detail: loginResponse }));
    }

    window.dispatchEvent(new Event('_endload'));
  }

  render(){
    return(
      <div className="login">
        <div className="login_container card ">
          <div className="login_container_logo"><img src={require('../assets/img/logo_klustera.png')} /></div>
          <div className="login_container_t">Por favor inicia sesión para ver este contenido.</div>

          <div className="login_container_form">
            <form onSubmit={(e) => this.onSubmit(e)}>
              <div className="login_container_form_tr">
                <input className={this.state.username ? 'withvalue' : ''} type="name" required onChange={(e) => this.setState({username: e.target.value})}/>
                <label>Usuario<span>*</span></label>
              </div>
              <div className="login_container_form_tr">
                <input className={this.state.password ? 'withvalue' : ''}  type="password" required onChange={(e) => this.setState({password: e.target.value})}/>
                <label>Contraseña<span>*</span></label>
              </div>
              <div className="login_container_form_ts">
                <button disabled={!this.state.username || !this.state.password}>Ingresar</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    )
  }

}
