import React,{Component} from 'react';
// import MyCalendar from './calendar';
import SinglePicker from './singlePicker';
import LineTravel from './lineTravel';
import LineTravelDep from './lineTravelDepartment';
import PieTravelDep from './pieTravelDepartment';
import ListTravelDep from './listTravelDepartment';
import {getFormat} from './../tool';

import {WhiteSpace,DatePicker,List } from 'antd-mobile';

import './../../css/statistic.css'

class Statistic extends Component {
	constructor() {
		super();
		this.state = {
			error: null,
			isLoaded: false,
            records: {},
            startdate:new Date((new Date()).getTime()- 30*24 * 60 * 60 * 1000),
            enddate:new Date((new Date()).getTime()),
            address:'所有城市',
        };
        this.getDate = this.getDate.bind(this);
        this.getCityName = this.getCityName.bind(this);
    }
    
    componentDidMount() {
        this.getDate();  
      }
    
    getDate(){
        let startTime = getFormat(this.state.startdate)
        let endTime = getFormat(this.state.enddate)

        this.refs.refSinglePicker.getCity(startTime,endTime);
        this.refs.refLineTravel.getLineTravel(startTime,endTime,this.state.address); 
        this.refs.refLineTravelDep.getLineTravelDep(startTime,endTime,this.state.address);
        this.refs.refPieTravelDep.getPieTravelDep(startTime,endTime,this.state.address);
        this.refs.refListTravelDep.getListTravelDep(startTime,endTime,this.state.address);   
    }
    
    getCityName(address){
        this.setState({
            address
        })

        let startTime = getFormat(this.state.startdate)
        let endTime = getFormat(this.state.enddate)

        this.refs.refLineTravel.getLineTravel(startTime,endTime,address);
        this.refs.refLineTravelDep.getLineTravelDep(startTime,endTime,address);
        this.refs.refPieTravelDep.getPieTravelDep(startTime,endTime,address);
        this.refs.refListTravelDep.getListTravelDep(startTime,endTime,address);
    }

    changeStartDate(date) {
        this.setState({
          startdate:date
        })
       
        let startTime = getFormat(date)
        let endTime = getFormat(this.state.enddate)

        this.refs.refSinglePicker.getCity( startTime , endTime);
        this.refs.refLineTravel.getLineTravel(startTime,endTime,this.state.address); 
        this.refs.refLineTravelDep.getLineTravelDep(startTime,endTime,this.state.address);
        this.refs.refPieTravelDep.getPieTravelDep(startTime,endTime,this.state.address);
        this.refs.refListTravelDep.getListTravelDep(startTime,endTime,this.state.address);  
        
      }

    changeEndDate(date) {
        this.setState({
          enddate:date
        })

        let startTime = getFormat(this.state.startdate)
        let endTime = getFormat(date)

        this.refs.refSinglePicker.getCity( startTime , endTime);
        this.refs.refLineTravel.getLineTravel(startTime,endTime,this.state.address); 
        this.refs.refLineTravelDep.getLineTravelDep(startTime,endTime,this.state.address);
        this.refs.refPieTravelDep.getPieTravelDep(startTime,endTime,this.state.address);
        this.refs.refListTravelDep.getListTravelDep(startTime,endTime,this.state.address);  
        
      }

	render() {
    return(
        <div className="container-div touch ">

            <DatePicker
            mode="date"
            title="开始时间"
            extra={ getFormat(this.state.startdate) }
            value={ this.state.startdate }
            onChange={ date => this.changeStartDate(date) }  
            >
                <List.Item arrow="horizontal">开始时间</List.Item>
            </DatePicker>

            <WhiteSpace size="sm" />

            <DatePicker
            mode="date"
            title="结束时间"
            extra={getFormat(this.state.enddate)}
            value={this.state.enddate}
            onChange={date => this.changeEndDate(date)}
            >
                <List.Item arrow="horizontal">结束时间</List.Item>
            </DatePicker>

            <WhiteSpace size="sm" />

            <SinglePicker getCityName={this.getCityName} startTime={this.state.startTime} endTime={this.state.endTime} ref="refSinglePicker"/>

            <WhiteSpace size="md" />
            <LineTravel startTime={this.state.startTime} endTime={this.state.endTime} address={this.state.address} ref="refLineTravel" />

            <WhiteSpace size="md" />
            <PieTravelDep startTime={this.state.startTime} endTime={this.state.endTime} address={this.state.address} ref="refPieTravelDep" />

            <WhiteSpace size="md" />
            <LineTravelDep startTime={this.state.startTime} endTime={this.state.endTime} address={this.state.address} ref="refLineTravelDep" />

            <WhiteSpace size="md" />
            <ListTravelDep startTime={this.state.startTime} endTime={this.state.endTime} address={this.state.address} ref="refListTravelDep" />  
        </div>
		
		);
	}
}
export default Statistic;