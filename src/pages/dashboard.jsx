import React from 'react';
import {Bar} from 'react-chartjs-2';

export default class Dashboard extends React.Component{
  state = {
    hasData: false
  }

  componentDidMount(){
    this.setInitialValues();
  }

  setInitialValues(){
    let self = this;

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    let todayString = yyyy+'-'+mm+'-'+dd;

    let yesterday = today - 1000 * 60 * 60 * 24 * 15;
        yesterday = new Date(yesterday);

    let y_dd = String(yesterday.getDate()).padStart(2, '0');
    let y_mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    let y_yyyy = yesterday.getFullYear();

    let yesterdayString = y_yyyy+'-'+y_mm+'-'+y_dd;


    this.setState({
      endDate: todayString,
      startDate: yesterdayString,
      startHour: 0,
      endHour: 23
    })
    setTimeout(() => this.fetch(), 100);

  }

  setDate(value, type){
    let stateKey = type == "start" ? 'startDate' : 'endDate';
    let other = type == "start" ? 'endDate' : 'startDate';
    let otherState = this.state[other];

    let isBigger = new Date(value) > new Date(otherState);

    if(isBigger && type == "start"){
      let oc = new Date(value).getTime() + (24 * 60 * 60 * 1000 * 2);
          oc = new Date(oc);
      let dd = String(oc.getDate()).padStart(2, '0');
      let mm = String(oc.getMonth() + 1).padStart(2, '0');
      let yyyy = oc.getFullYear();
      let otherString = yyyy+'-'+mm+'-'+dd;
      this.setState({
        endDate: otherString
      })
    }

    if(!isBigger && type == "end"){
      let oc = new Date(value).getTime() + (24 * 60 * 60 * 1000 * -1);
          oc = new Date(oc);
      let dd = String(oc.getDate()).padStart(2, '0');
      let mm = String(oc.getMonth() + 1).padStart(2, '0');
      let yyyy = oc.getFullYear();
      let otherString = yyyy+'-'+mm+'-'+dd;
      this.setState({
        startDate: otherString
      })
    }
    this.setState({[stateKey]: value});

  }

  changeHour(value, type){
    let stateKey = type == "start" ? 'startHour' : 'endHour';

    value = Math.max(value, 0);
    value = Math.min(value, 23);

    this.setState({[stateKey]: value});
  }

  async fetch(){
    window.dispatchEvent(new Event('_startload'));

    let sh = this.state.startHour < 10 ? '0' + this.state.startHour : this.state.startHour;
    let eh = this.state.endHour < 10 ? '0' + this.state.endHour : this.state.endHour;

    let obj = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      startHour: sh,
      endHour: eh,
    }

    let r = await window.factory.getData(obj);

    this.setState({
      hasData: true,
      kpis: r.kpis,
      footprint: r.footprint
    })

    window.dispatchEvent(new Event('_endload'));
  }

  render(){
    return(
      <div className="dashboard">
        <div className="dashboard_topbar dashboard_padme">

          <div className="dashboard_topbar_container">
            <div className="dashboard_topbar_container_td">
              <div className="dashboard_topbar_container_td_box">
                <div className="dashboard_topbar_container_td_box_label">Period</div>
                <div className="dashboard_topbar_container_td_box_input">
                  <input
                    type="date"
                    format="YYYY-mm-dd"
                    value={this.state.startDate}
                    onChange={(e) => this.setDate(e.target.value, 'start')}
                  />
                </div>
              </div>
              <div className="dashboard_topbar_container_td_box">
                <div className="dashboard_topbar_container_td_box_label"></div>
                <div className="dashboard_topbar_container_td_box_input">
                  <input
                    type="date"
                    format="YYYY-mm-dd"
                    value={this.state.endDate}
                    onChange={(e) => this.setDate(e.target.value, 'end')}
                  />
                </div>
              </div>
            </div>
            <div className="dashboard_topbar_container_td">
              <div className="dashboard_topbar_container_td_box">
                <div className="dashboard_topbar_container_td_box_label">Start hour</div>
                <div className="dashboard_topbar_container_td_box_input">
                  <input
                    value={this.state.startHour}
                    onChange={(e) => this.changeHour(e.target.value, 'start')}
                    className="small"
                  />
                </div>
              </div>
              <div className="dashboard_topbar_container_td">
                <div className="dashboard_topbar_container_td_box">
                  <div className="dashboard_topbar_container_td_box_label">End hour</div>
                  <div className="dashboard_topbar_container_td_box_input">
                    <input
                      className="small"
                      value={this.state.endHour}
                      onChange={(e) => this.changeHour(e.target.value, 'end')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard_topbar_container_td">
              <div className="dashboard_topbar_container_td_box">
                <div className="dashboard_topbar_container_td_box_label">Refresh</div>
                <div
                  onClick={() => this.set()}
                  className="dashboard_topbar_container_td_box_button">
                  Refresh
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard_content dashboard_padme">
          {
            this.state.hasData ?
            <div>
              <KPIs kpis={this.state.kpis}/>
              <FootTraffic data={this.state.footprint} />
            </div>
            : null
          }
        </div>
      </div>
    )
  }
}

class KPIs extends React.Component{
  render(){
    let cleanKpis = [
      {
        icon: 'face',
        color: '#9cedc9',
        title: 'Unique Visitors',
        value: this.props.kpis.clients
      },
      {
        icon: 'check',
        color: '#3edd96',
        title: 'Visits',
        value: this.props.kpis.visits
      },
      {
        icon: 'star_border',
        color: '#3fbbdc',
        title: '% Unique Visitors',
        value: Math.round((parseInt(this.props.kpis.clients) / parseInt(this.props.kpis.visits)) * 100)+ '%'
      },
      {
        icon: 'alarm_on',
        color: '#63e3aa',
        title: 'Avg Time (minutes)',
        value: Math.round(this.props.kpis.avg_stay)
      },
      {
        icon: 'sentiment_very_satisfied',
        color: '#6c747e',
        title: 'Unique Loyals',
        value: this.props.kpis.loyals
      },
      {
        icon: 'loop',
        color: '#23d0d0',
        title: '% Loyalty Visitors',
        value: Math.floor((parseInt(this.props.kpis.loyals) / parseInt(this.props.kpis.clients)) * 100) + '%'
      },
      {
        icon: 'trending_up',
        color: '#3fbbdc',
        title: 'Frequency of visit',
        value: Math.round((parseInt(this.props.kpis.impacts) / parseInt(this.props.kpis.potential_clients)) * 10) / 10
      },
      {
        icon: 'shopping_cart',
        color: '#3fbbdc',
        title: 'Unique Passengers',
        value: this.props.kpis.potential_clients
      }
    ];
    return(
      <div className="dashboard_content_kpis">
        {
          cleanKpis.map(function(kpi){
            return (<KPI data={kpi} />)
          })
        }
      </div>
    )
  }
}

class KPI extends React.Component{
  render(){
    return(
      <div className="dashboard_content_kpis_kpi">
        <div className="dashboard_content_kpis_kpi_c card">
          <div className="dashboard_content_kpis_kpi_c_icon"><i className="material-icons" style={{color: this.props.data.color}}>{this.props.data.icon}</i></div>
          <div className="dashboard_content_kpis_kpi_c_data">
            <div className="dashboard_content_kpis_kpi_c_data_label">{this.props.data.title}</div>
            <div className="dashboard_content_kpis_kpi_c_data_value">{this.props.data.value}</div>
          </div>
        </div>
      </div>
    )
  }
}

class FootTraffic extends React.Component{
  render(){
    let data = this.props.data;
    console.log('DATA', data);

    let labels = [];
    let d1 = [];
    let d2 = [];

    for(let i = 0; i < data.length; i++){
      let row = data[i];
      labels.push(row[0]);
      d1.push(row[1]);
      d2.push(row[2]);
    }

    const d = {
      labels: labels,
      datasets: [
        {
          label: 'Visits',
          backgroundColor: '#00ee22',
          borderWidth: 0,
          data: d2
        },
        {
          label: 'Passersby',
          backgroundColor: '#2c8dff',
          borderWidth: 0,
          data: d1
        },
      ],
    };

    return(
      <div className="dashboard_content_fp">
        <div className="dashboard_content_fp_ts">
          <div className="dashboard_content_fp_ts_title">Foot Traffic</div>
          <div className="dashboard_content_fp_ts_badge_c"><div>Day by day</div></div>
        </div>
        <div className="dashboard_content_fp_graph">
          <Bar
            data={d}
            height={400}
            options={{
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                }],
              }
            }}
          />
        </div>
      </div>
    )
  }
}
