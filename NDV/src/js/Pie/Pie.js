import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { Result } from 'antd-mobile';

const ReactHighcharts = require('react-highcharts');
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

class Pie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandsList:[],
      config:{}
    }
  }

  setPieConfig(brandsList,all,allPerform,allFault,faultRate) {
    var windowWidth = window.screen.width;
    let option = {
          chart: {
            type: 'pie',
            height: '200',
            spacing: [0, 0, 0, 0],
            spacingTop: 10,
            spacingBottom: 20, 
            spacingRight: 150,
            animation: {
              duration: 1000
            }
          },
          title: {
            text: null
          },
          colors:['#FFA550','#008B8B'],
          labels: {
            items: [
              {
                html: '<span>播放总次数：'+all+'</span>',
                style: {
                          left: (windowWidth-100),
                          top: '30px',
                          color:'#000000',
                          fontSize:'12px',
                          fontWeight:'bold',
                          fontFamily:'微软雅黑'
                        }
                },
                {
                  html: '<span>异常率：'+faultRate+' %</span>',
                  style: {
                            left: (windowWidth-100),
                            top: '60px',
                            color:'#000000',
                            fontSize:'12px',
                            fontWeight:'bold',
                            fontFamily:'微软雅黑'
                          }
                  },
              {
                html: '<span>正常次数：'+allPerform+'</span>',
                style: {
                          left: (windowWidth-100),
                          top: '90px',
                          color:'#008B8B',
                          fontSize:'12px',
                          fontWeight:'bold',
                          fontFamily:'微软雅黑'
                        }
                },
                {
                  html: '<span>异常次数：'+allFault+'</span>',
                  style: {
                            left: (windowWidth-100),
                            top: '120px',
                            color:'#ffa550',
                            fontSize:'12px',
                            fontWeight:'bold',
                            fontFamily:'微软雅黑'
                          }
                  }
              ],
            },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          credits: {
            enabled: false
          },
          plotOptions: { 
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
              }
            },
            
          },
          series: [{
            innerSize: '60%',
            name: '占比',
            data: brandsList
          }]
        }
      
      this.setState({
        brandsList,
        config:option
      })
}


  render() {
    return (<div>
            {
              this.state.brandsList.length != 0 ? <ReactHighcharts config = { this.state.config } />:
              <Result
                img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
                title="无数据"
              />
            }
          </div>)
  }
}

export default Pie;