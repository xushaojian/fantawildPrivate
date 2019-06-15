import React, { Component } from 'react';
import { Result } from 'antd-mobile';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

class Bar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yfaultdata:[],
			ynormaldata:[],
			xdata:[],
			config:{},
			isShow:false
		}
	}
		
	setBarConfig(columnData){
		//如果全为0，着表示没有数据
		let noData = false;
		for(let i in  columnData.yfaultdata){
			if(columnData.yfaultdata[i] != 0){
				noData = true;
			}
		}

		for(let i in  columnData.ynormaldata){
			if(columnData.ynormaldata[i] != 0){
				noData = true;
			}
		}


		let option = {
			chart: {
				type: 'column',
				height: 300,
			},
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			colors: ['#FFA550', '#458B74', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'] ,
			xAxis: {
				lineColor: '#9C9C9C',
				lineWidth: 1,
				tickLength: 0,
				labels: {
					style: {
					  color: '#9C9C9C'
					}
				},
				categories: columnData.xdata
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
					}
				},
			},
			legend: {
				verticalAlign: 'top',
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						this.series.name + ': ' + this.y + '<br/>' +
						'总量: ' + this.point.stackTotal;
				}
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true,
						color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
						style: {
							textOutline: '1px 1px black'
						}
					}
				}
			},
			series: [{
				name: '异常场次',
				data: columnData.yfaultdata
			}, {
				name: '正常场次',
				data: columnData.ynormaldata
			}]
		}

		this.setState({
			yfaultdata:columnData.yfaultdata,
			ynormaldata:columnData.ynormaldata,
			xdata:columnData.xdata,
			config:option,
			isShow:noData
		})

	}

  render() {
    return <div>
		{
			this.state.isShow ? <ReactHighcharts config = { this.state.config }></ReactHighcharts> :
			<Result
				img={myImg('https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg')}
				title="无数据"
			/> 
		}
    </div>
  }
}

export default Bar;