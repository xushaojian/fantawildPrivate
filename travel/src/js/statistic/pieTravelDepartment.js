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

class PieTravelDep extends Component{
    constructor(props) {
        super(props);
        this.state = {
            options : {}
        };
      }

      componentDidMount(){
        this.getPieTravelDep();
    }
      
    getPieTravelDep(startTime=this.props.startTime, endTime=this.props.endTime, address=this.props.address) {
        let options = null;
        getJSON(CONFIG.GET_DEPARTMENT_TRAVEL_PIE + '?startTime=' + startTime + '&endTime=' + endTime + '&address=' + address).then(
            result => {
                let PieDate = [];

                if(result.Code==200&&result.Msg=='SUCCESS'){  
                    for(let i=0 ; i < result.Data.length ; i++){
                        let PieItem = {name:'',y:0};
                        PieItem.name = result.Data[i][0];
                        PieItem.y = result.Data[i][1];
                        PieDate.push(PieItem);
                    }
                }
                
                options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                            text: '各所出差天数占比('+address+')'
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '{point.key}<br>',
		                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            showInLegend: true,
                            
                            dataLabels: {
                                enabled: false,
                            },
                            
                            slicedOffset: 30,         
                            point: {                  
                                events: {
                                    click: function() {
                                        return 'true';
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                            type: 'pie',
                            name: '天数占比',
                            data: PieDate
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
            <HighchartsReact
                config = {this.state.options}
            />
            </div>
          );
      }

}

export default PieTravelDep