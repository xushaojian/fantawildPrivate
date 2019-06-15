import React,{Component} from 'react'
import {getJSON} from 'jquery'
import CONFIG from './../config'
import './../../css/statistic.css'

class ListTravelDep extends Component{
    constructor(props) {
        super(props);
        this.state = {
            totalPopNum:0,
            totalDayNum:0,
            tableData : []
        };
      }

      componentDidMount(){
        this.getListTravelDep();
    }
      
    getListTravelDep(startTime=this.props.startTime, endTime=this.props.endTime, address=this.props.address) {
        getJSON(CONFIG.GET_DEPARTMENT_TRAVEL_LIST + '?startTime=' + startTime + '&endTime=' + endTime + '&address=' + address).then(
            result => {
                let totalPopNum = 0 ;
                let totalDayNum = 0 ;
                result.Data.map((item)=>{
                    totalPopNum+=item.lat;
                    totalDayNum+=item.lon;
                })

                this.setState({
                    totalPopNum,
                    totalDayNum,
                    tableData:result.Data
                });
            },
            error => {
                this.setState({
                    error: '请求出错了'
                })
            },
        )
    }

    getTr(){
            return this.state.tableData.map((itemP,indexP)=>{
                return <tbody key={indexP}>
                            <tr>
                                <td rowSpan={itemP.lat}>{itemP.cityname+'/'+itemP.lat+'人/'+itemP.lon+'天'}</td>
                                <td>{itemP.data[0].UserName}</td>
                                <td>{itemP.data[0].DayNum}</td>
                            </tr>
                            {
                                itemP.data.map((itemS,indexS)=>{
                                if(indexS!=0)
                                return <tr key={indexS}>
                                            <td>{itemS.UserName}</td>
                                            <td>{itemS.DayNum}</td>
                                        </tr>
                                })
                            }
                        </tbody>
            })
    }

      render(){
          return(
            <div>
            <table>
                <thead>
                    <tr>
                        <th>部门/人数/总天数</th>
                        <th>姓名</th>
                        <th>天数</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colSpan="3" style={{color:"#FFA550"}}>{'合计： '+this.state.totalPopNum+' 人 / 共 '+this.state.totalDayNum+' 天'}</td>
                    </tr>
                </tfoot>
                {this.getTr()}
            </table>
            </div>
          );
      }

}

export default ListTravelDep