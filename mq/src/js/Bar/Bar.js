import React, { Component } from 'react';
import { Result } from 'antd-mobile';


const ReactHighcharts = require('react-highcharts');
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

class Bar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			xdata:[],
			ydata:[],
		  config:{}
		}
	}
		
	setBarConfig(columnList){

		//根据ydata的长度计算图形的高度，ydata.length=2 / ydata.length = 1 时 chartHeight = 100 ,大于2部分每加1 chartHeight 需加50
		let chartHeight = 100;
		if(columnList.ydata.length > 2 && columnList.ydata.length < 8){
			chartHeight = columnList.ydata.length * 40
		}else if(columnList.ydata.length > 7){
			chartHeight = columnList.ydata.length * 25
		}

		let option = {
			chart: {
				height: chartHeight,
				type: 'bar'
			},
			legend: {
				enabled: false
			},
			title: {
				text: null
			},
			credits: {
				enabled: false
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
        series: {
			color: '#FFA550',
            dataLabels: {
                enabled: true,
                align: 'right',
                color: '#FFFFFF',
                x: -10
						} 
        }
    },
			xAxis: {
				lineColor: '#108ee9',
				lineWidth: 1,
				tickLength: 0,
				labels: {
					style: {
					  color: '#108ee9'
					}
				},
				categories: columnList.xdata,
			},
			yAxis: {
				allowDecimals: false,
				lineColor: '#108ee9',
				lineWidth: 1,
				gridLineColor: '#ffffff',
				title: {
					text: null
				},
				labels: {
					style: {
					  color: '#108ee9'
					}
				},
			},
			series: [{
				data: columnList.ydata,
			
			}]
		}

		this.setState({
			xdata:columnList.xdata,
			ydata:columnList.ydata,
			config:option
		})

	}


  render() {
    return <div>
		{
			this.state.xdata.length != 0 ? <ReactHighcharts config = { this.state.config }></ReactHighcharts> :
			<Result
				img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
				title="无数据"
			/>
		}
    
		
    </div>
  }
}

export default Bar;