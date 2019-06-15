import React,{Component} from 'react'
import HighchartsReact from 'react-highcharts'
import {getJSON} from 'jquery'
import CONFIG from './../config'

class LineTravelDep extends Component{
    constructor(props) {
        super(props);
        this.state = {
            options : {}
        };
      }
      componentDidMount(){
        this.getLineTravelDep();
    }
      
    getLineTravelDep(startTime = this.props.startTime, endTime = this.props.endTime, address = this.props.address) {
        let options = null;
        getJSON(CONFIG.GET_DEPARTMENT_TRAVEL_LINE_CHARTS + '?startTime=' + startTime + '&endTime=' + endTime + '&address=' + address).then(
            result => {
                let num = 0;
                if (result.Data.xdata.length >= 300) {
                    num = 40;
                } else if (result.Data.xdata.length < 300 && result.Data.xdata.length >= 200) {
                    num = 30;
                } else if (result.Data.xdata.length < 200 && result.Data.xdata.length >= 100) {
                    num = 20;
                } else if (result.Data.xdata.length < 100 && result.Data.xdata.length >= 11) {
                    num = 10;
                } else if (result.Data.xdata.length < 11) {
                    num = 1;
                }

                options = {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: '各部门出差人数(' + address + ')'
                    },
                    xAxis: {
                        tickInterval: num,
                        categories: result.Data.xdata
                    },
                    exporting: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        spline: {
                            dataLabels: {
                                enabled: false
                            },
                            marker: {
                                enabled: false
                            },
                        }
                    },
                    series: result.Data.ydata
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

export default LineTravelDep