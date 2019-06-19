import React from 'react';
import { Card, Row, Col ,Icon,Button} from 'antd';

class CardView extends React.Component {

	constructor() {
		super();
		this.state = {
			statusColor:{
				'未知':'#FFA500',
				'运营中':'#00BFFF',
				'接待中':'#1E90FF',
				'停止':'#FF0000'
			}
		};
	}

	renderItem(data, index) {
			return (
				<Col span={5} key={index} style={{ marginBottom: '40px'}}>
					<Card key={index}
						size="small"
						title={data.ParkName + '-' + data.ProjectName}
						extra={<div style={{color: this.state.statusColor[data.ProjectStatus] }}> 
						{data.ProjectStatus}
						<Icon type="bulb" theme="filled" style={{fontSize: '20px',  color:this.state.statusColor[data.ProjectStatus] }}/> 
						</div>}
						style={{ width: 320, borderRadius: '7px', backgroundColor: '#F0F8FF' }}
						headStyle={{ color: this.state.statusColor[data.ProjectStatus] }}>

						<p>开机时间 : {data.OpenTime.substring(0, 19).replace('T',' ')}</p>
						<p>停机时间 : {data.CloseTime.substring(0, 19).replace('T',' ')}</p>
						<p>运行场次 : {data.RunTimes} ( 场 )</p>
						<p>场均时长 : {data.TimesLength} ( s )</p>
						<p>当前场次时长 : {data.CurrTimesLength} ( s )</p>
						<p>更新时间 : {data.UpdateTime.substring(0, 19).replace('T',' ')}</p>
					</Card>
				</Col>
			);	
	}

	render() {
		let data = this.props.data || [];
		return (
			<div>
				
				<Row justify='start'>
					{data.map((item, index) => (
						this.renderItem(item, index)
					))}
				</Row>
			</div>
		)
	}
}

export default CardView;