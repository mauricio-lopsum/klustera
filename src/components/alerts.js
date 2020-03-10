import React from 'react';

export default class Alerts extends React.Component{
  render(){
    return(
      <div>
        <Loader />
        <Alert />
      </div>
    )
  }
}

class Alert extends React.Component{
  state = {
    text: ''
  }

  componentDidMount(){
    let self = this;
    window.addEventListener('_showalert', function(e){
      var t = e.detail;
      self.setState({
        text: t
      })
    })
  }

  render(){
    if(!this.state.text){
      return null;
    }
    return(
      <div id="alert">
        <div id="alert_bg" onClick={() => this.setState({text: ''})}></div>
        <div id="alert_box">
          <div id="alert_box_title"><i className="material-icons">info</i>Aviso</div>
          <div id="alert_box_content">{this.state.text}</div>
          <div className="alert_box_ctas">
            <div className="alert_box_ctas_cta" onClick={() => this.setState({text: ''})}>
              OK!
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Loader extends React.Component{
  state = {
    isloading: false
  }

  componentDidMount(){
    window.addEventListener('_startload', () => this.setState({isloading: true}));
    window.addEventListener('_endload', () => this.setState({isloading: false}));
    window.addEventListener('_toggleload', () => this.setState({isloading: !this.state.isloading}));
  }

  render(){
    if(!this.state.isloading){
      return null;
    }
    return(
      <div id="loader"></div>
    )
  }

}
