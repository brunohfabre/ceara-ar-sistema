import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';

import Header from './Header';

class Resume extends Component {
  componentDidMount() {
    var ctx = document.getElementById("pieChart");
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: [
              10, 20
            ],
            backgroundColor: ['#FF7E7E', '#5F9ADC'],
          }],
          labels: ['despesa', 'receita']
        },
        options: {
          responsive: true
        }
    });

    var ctx = document.getElementById("lineChart");
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['teset', 'bruno', 'bruno 2', 'bruno 5'],
          datasets: [{
            label: 'despesa',
            backgroundColor: '#FF7E7E',
            borderColor: '#FF7E7E',
            data: [
              10, 20, 15, 30
            ],
            fill: false
          }, {
            label: 'receita',
            backgroundColor: '#5F9ADC',
            borderColor: '#5F9ADC',
            data: [
              30, 20, 18, 25
            ],
            fill: false
          }]
        },
        options: {
          responsive: true
        }
    });
  }
  render() {
    return(
      <div>
        <Header currentUser={this.props.user} />
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 col-lg-4' style={{marginBottom: '48px'}} align='center'>
              <h4>Gráfico Mensal (Novembro)</h4>
              <div className='chart-container'>
                <canvas id="pieChart"></canvas>
              </div>
            </div>
            <div className='col-md-12 col-lg-8' align='center'>
              <h4>Gráfico Anual (2017)</h4>
              <div className='chart-container'>
                <canvas id="lineChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps, null)(Resume);
