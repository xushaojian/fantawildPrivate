import React, { Component } from 'react';
import { Result } from 'antd-mobile';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

class Bar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yData:[],
			xData:[],
		    config:{}
		}
	}
		
	setLineConfig(yData,xData,name){

        let unit = ''

        if(name==="总运行时长"){
            unit = '分'
        }else if(name==="故障率"){
            unit = '%'
        }else if(name==="总运行圈数"){
            unit = '圈'
        }

		let option = {
            chart: {
                type: 'column',
                height: 250,
            },
            title: {
                text: ''
            },
            credits: {
				enabled: false
            },
            legend: {
				enabled:false
			},
            xAxis: {
                categories: xData
            },
            yAxis: {
                allowDecimals: false,
				lineColor: '#9C9C9C',
				lineWidth: 1,
				gridLineColor: '#ffffff',
				title: {
					text: null
				},
				labels: {
					style: {
					  color: '#9C9C9C'
                    },
                    formatter: function () {
                        return this.value + unit;
                    }
				},
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    return this.x + ' ' +  name + ' : ' + this.y + unit;
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 3,
                        lineColor: '#FFA550',
                        lineWidth: 1
                    }
                }
            },
            series: [{
                name: name,
                marker: {
                    symbol: 'square'
                },
                data: yData
            }]
        }
		this.setState({
			yData,
			xData,
			config:option
		})
	}

  render() {
    return <div>
		{
			this.state.xData.length != 0 ? <ReactHighcharts config = { this.state.config }></ReactHighcharts> :
			<Result
				img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
				title="无数据"
			/> 
		}
    </div>
  }
}

export default Bar;