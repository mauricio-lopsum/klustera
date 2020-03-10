import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Factory from "./funcs/factory";
import './style.css';

/* Ayuda a direccionar las páginas de forma correcta dependiendo del ambiente */
import buildLink from "./funcs/buildLink";

/* Components */
import Alerts from './components/alerts';

/* Pages */
import Login from './pages/login';
import Dashboard from './pages/dashboard';

/* Carga la clase de forma global */
let factory = new Factory();
window.factory = factory;

export default class App extends React.Component{

  state = {
    islogged: window.factory.isLogged()
  }

  componentDidMount(){
    let self = this;
    window.addEventListener('_loginchange', () => this.readCookie());
    /* Previene que el usuario pueda usar la plataforma una vez que la cookie expiró */
    setInterval(function(){
      self.readCookie();
    }, 1000 * 30);
  }

  readCookie(){
    let isLogged = window.factory.isLogged();
    console.log('isLogged', isLogged);
    if(isLogged !== this.state.islogged){
      this.setState({
        islogged: isLogged
      })
    }
  }


  render(){
    return(
      <Router>
        <div id="wrapper">
          <Alerts />
          <div id="binder">
            <Switch>
              {
                !this.state.islogged ?
                <Route path={buildLink("*")} component={Login} />
                :
                <Route path={buildLink("*")} component={Dashboard} />
              }
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
