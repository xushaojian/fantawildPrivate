import React from 'react';
import { Card, Row, Col } from 'antd';

class CardView extends React.Component {

	constructor() {
		super();
		this.state = {

		};
	}

	renderItem(data, index) {
		if (data.projectStatus == '未知') {
			return (
				<Col span={5} style={{ marginBottom: '40px' }}>
					<Card key={index}
						size="small"
						title={data.parkName + '-' + data.projectName}
						extra={<div style={{ color: '#FFA500' }}> {data.projectStatus} </div>}
						style={{ width: 350, borderRadius: '7px', backgroundColor: '#F0F8FF' }}
						headStyle={{ borderRadius: '7px 7px 0px 0px', color: '#FFA500' }}>
						<p>开机时间 : {data.bootUpTime}</p>
						<p>停机时间 : {data.shutdownTime}</p>
						<p>运行场次 : {data.runFieldNum}</p>
						<p>场均时长 : {data.fieldAvgTime} </p>
						<p>更新时间 : {data.updateTime}</p>
					</Card>
				</Col>
			);
		} else if (data.projectStatus == '停止') {
			return (
				<Col span={5} style={{ marginBottom: '40px' }}>
					<Card key={index}
						size="small"
						title={data.parkName + '-' + data.projectName}
						extra={<div style={{ color: '#FF0000' }}> {data.projectStatus} </div>}
						style={{ width: 350, borderRadius: '7px', backgroundColor: '#F0F8FF' }}
						headStyle={{ borderRadius: '7px 7px 0px 0px', color: '#FF0000' }}>
						<p>开机时间 : {data.bootUpTime}</p>
						<p>停机时间 : {data.shutdownTime}</p>
						<p>运行场次 : {data.runFieldNum}</p>
						<p>场均时长 : {data.fieldAvgTime} </p>
						<p>更新时间 : {data.updateTime}</p>
					</Card>
				</Col>
			);
		} else if (data.projectStatus == '运营中') {
			return (
				<Col span={5} style={{ marginBottom: '40px' }}>
					<Card key={index}
						size="small"
						title={data.parkName + '-' + data.projectName}
						extra={<div style={{ color: '#00BFFF' }}> {data.projectStatus} </div>}
						style={{ width: 350, borderRadius: '7px', backgroundColor: '#F0F8FF' }}
						headStyle={{ borderRadius: '7px 7px 0px 0px', color: '#00BFFF' }}>
						<p>开机时间 : {data.bootUpTime}</p>
						<p>停机时间 : {data.shutdownTime}</p>
						<p>运行场次 : {data.runFieldNum}</p>
						<p>场均时长 : {data.fieldAvgTime} </p>
						<p>更新时间 : {data.updateTime}</p>
					</Card>
				</Col>
			);
		} else if (data.projectStatus == '接待中') {
			return (
				<Col span={5} style={{ marginBottom: '40px' }}>
					<Card key={index}
						size="small"
						title={data.parkName + '-' + data.projectName}
						extra={<div style={{ color: '#1E90FF' }}> {data.projectStatus} </div>}
						style={{ width: 350, borderRadius: '7px', backgroundColor: '#F0F8FF' }}
						headStyle={{ borderRadius: '7px 7px 0px 0px', color: '#1E90FF' }}>
						<p>开机时间 : {data.bootUpTime}</p>
						<p>停机时间 : {data.shutdownTime}</p>
						<p>运行场次 : {data.runFieldNum}</p>
						<p>场均时长 : {data.fieldAvgTime} </p>
						<p>更新时间 : {data.updateTime}</p>
					</Card>
				</Col>
			);
		}
	}


	render() {
		console.log("CardList");
		console.log(this.props.data);
		return (
			<div>
				<Row justify='start'>
					{this.props.data.map((item, index) => (
						this.renderItem(item.data, index)
					))}
				</Row>
			</div>
		)
	}
}

export default CardView;