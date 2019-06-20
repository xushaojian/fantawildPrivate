import React from 'react';
import { connect } from 'dva';
import { Table, Tag ,Button } from 'antd';

const columns = [
	{
		title: '公园名称',
		dataIndex: 'ParkName',
		key: 'ParkName',
	},
	{
		title: '项目名称',
		dataIndex: 'ProjectName',
		key: 'ProjectName',
	},
	{
		title: '设备名称',
		dataIndex: 'DeviceName',
		key: 'DeviceName',
	},
	{
		title: '设备编号',
		dataIndex: 'DeviceNo',
		key: 'DeviceNo',
	},
	{
		title: '设备类别',
		dataIndex: 'DeviceType',
		key: 'DeviceType',
	},
	{
		title: '设备状态',
		key: 'DeviceStatus',
		dataIndex: 'DeviceStatus',
		render: (DeviceStatus) => (<Tag color={DeviceStatus == '离线' ? 'red' : 'blue'} key={DeviceStatus}> {DeviceStatus} </Tag>),
	},
	{
		title: '更新时间',
		dataIndex: 'UpdateTime',
		key: 'UpdateTime',
		render: (UpdateTime) => (UpdateTime.substring(0, 19).replace('T', ' ')),
	},
	// {
	// 	title: '操作',
	// 	key: 'action',
	// 	render: (text, record) => (
	// 		<span>
	// 			<a href="javascript:;">设备位置曲线</a>
	// 		</span>
	// 	),
	// },
];

@connect(({ driveStatus, loading }) => ({
	myResult: driveStatus.myResult,
	loading: loading.models.driveStatus
}))

export default class DriveStatus extends React.Component {

	componentWillMount() {
		this.props.dispatch({
			type: 'driveStatus/getDriveStatus',
		})

		this.timerID = setInterval(
			() => this.myRefresh(),
			30000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timerID)
	}

	myRefresh() {
		this.props.dispatch({
			type: 'driveStatus/getDriveStatus',
		})
	}

	render() {
		let that = this;
		return (
			<div style={{ backgroundColor: '#fff' }}>
				<div style={{padding:'20px'}}>
					<Button type="primary" style={{marginRight:'20px'}}>拉玛传奇</Button>
					<Button  style={{marginRight:'20px'}}>飞越极限</Button>
					<Button  style={{marginRight:'20px'}}>欢天喜地</Button>
					<Button  style={{marginRight:'20px'}}>生命之光</Button>
				</div>,
				(每30秒自动刷新)
				<Table columns={columns} dataSource={that.props.myResult.data || []} pagination={false} bordered={true} size='middle' />
			</div>
		)
	}
}






