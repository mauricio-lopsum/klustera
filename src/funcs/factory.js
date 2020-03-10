let base64 = require('base-64');

export default class Factory{
  baseurl = "https://voldemort.klustera.com";

  /**
  * Guarda una cookie
  *
  * @param string name
  * @param string value
  * @param hours int
  * @return null
  **/
  setCookie(name,value,hours) {
    var expires = "";
    if (hours){
      var date = new Date();
      date.setTime(date.getTime() + (hours*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  /**
  * Obtiene una cookie
  *
  * @param name
  * @return string | null
  **/
  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  /**
  * Destruye una cookie
  *
  * @param name
  * @return void
  **/
  eraseCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }


  /**
  * Construye un URL con base en un endpoint del REST API
  *
  * @param string endpoint
  * @return string url
  **/
  buildURL(endpoint){
    return this.baseurl + "/" + endpoint;
  }

  /**
  * Logout
  *
  * @param void
  * @return void
  **/
  logout(){
    this.eraseCookie('klustera_token');
    window.dispatchEvent(new Event('_loginchange'));
    window.dispatchEvent(new CustomEvent('_showalert', { detail: 'Sesión cerrada con éxito.' }));

  }

  /**
  * Intenta hacer login
  *
  * @async
  * @param string username
  * @param string password
  * @return bool
  **/
  async login(username, password){
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    let r = await fetch(this.buildURL("login"), {method: 'GET', headers: headers});
    let t = await r.text();
    let j = t;
    let isok = false;
    try{
      j = JSON.parse(t);
      isok = true;
      this.setCookie(
        'klustera_token',
        j.token,
        2
      );
    }catch{

    }
    return !isok ? j : true;
  }

  /**
  * Determina si el usuario está loggeado
  *
  * @param void
  * @return bool
  **/
  isLogged(){
    return this.getCookie('klustera_token') ? true : false;
  }

  /**
  * Realiza una llamada autorizada con el token
  *
  * @param string endpoint
  * @param object obj
  * @return object response
  **/
  async authCall(endpoint, obj){
    let headers = new Headers();
    let token = this.getCookie('klustera_token');
    headers.set('x-access-token', token);
    let r = await fetch(this.buildURL(endpoint), {method: 'GET', headers: headers});
    let t = await r.json();
    return t;
  }


  /**
  * Obtiene la data para el dashboard
  *
  * @param Object
  * @return Object
  **/
  async getData(obj){
    let output = {};
    let kpis_data = await this.authCall(`get_kpis/1159/${obj.startDate}/${obj.endDate}/${obj.startHour}/${obj.endHour}`)
    output.kpis = kpis_data.kpis;

    let footprint = await this.authCall(`fetch_daily_footprint/1159/${obj.startDate}/${obj.endDate}/${obj.startHour}/${obj.endHour}`)
    output.footprint = footprint.results.visitors_daily;

    return output;
  }


}
