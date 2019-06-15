import React,{Component} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'react-highcharts'
import {getJSON} from 'jquery'
import CONFIG from './../config'


Highcharts.setOptions({
	lang: {
        loading: '加载中...',
		shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月',  '七月', '八月', '九月', '十月', '十一月', '十二月'],
		weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	}
});

class LineTravel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            options : {}
        };
      }

      componentDidMount(){
        this.getLineTravel();
    }
      
    getLineTravel(startTime=this.props.startTime, endTime=this.props.endTime, address=this.props.address) {
        let options = null;
        getJSON(CONFIG.GET_LINE_TRAVEL_CHARTS + '?startTime=' + startTime + '&endTime=' + endTime + '&address=' + address).then(
            result => {
                options = {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: '出差人数曲线图(' + address + ')'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    tooltip: {
                        dateTimeLabelFormats: {
                            millisecond: '%H:%M:%S.%L',
                            second: '%H:%M:%S',
                            minute: '%H:%M',
                            hour: '%H:%M',
                            day: '%Y-%m-%d',
                            week: '%m-%d',
                            month: '%Y-%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        spline: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                enabled: false
                            },
                            lineWidth: 1.5,
                            states: {
                                hover: {
                                    lineWidth: 2
                                }
                            },
                            threshold: null
                        }
                    },
                    series: [{
                        type: 'spline',
                        name: '出差人数',
                        data: result.Data,
                        color: '#FFA550'
                    }]
                };

                this.setState({
                    options
                });
            },

            error => {
                this.setState({
                    error: '请求出错了'
                })
            },
        )
    }

      render(){
          return(
            <div>
            <HighchartsReact config = {this.state.options} />
            </div>
          );
      }

}

export default LineTravel