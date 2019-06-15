import React from 'react';
import { connect } from 'dva';
import { Table, Tag } from 'antd';

const columns = [
	{
		title: '公园名称',
		dataIndex: 'parkName',
		key: 'parkName',
	},
	{
		title: '项目名称',
		dataIndex: 'projectName',
		key: 'projectName',
	},
	{
		title: '设备名称',
		dataIndex: 'driveName',
		key: 'driveName',
	},
	{
		title: '设备编号',
		dataIndex: 'driveNum',
		key: 'driveNum',
	},
	{
		title: '设备类别',
		dataIndex: 'driveField',
		key: 'driveField',
	},
	{
		title: '设备状态',
		key: 'driveStatus',
		dataIndex: 'driveStatus',
		render: (driveStatus) => (<Tag color={driveStatus == '离线' ? 'volcano' : 'blue'} key={driveStatus}> {driveStatus} </Tag>),
	},
	{
		title: '更新时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
	},
	{
		title: '操作',
		key: 'action',
		render: (text, record) => (
			<span>
				<a href="javascript:;">设备位置曲线</a>
			</span>
		),
	},
];

@connect(({ driveStatus, loading }) => ({
	data: driveStatus.data,
	loading: loading.models.driveStatus
}))

export default class DriveStatus extends React.Component {

	componentWillMount() {
		this.props.dispatch({
			type: 'driveStatus/getDriveStatus',
		})
	}

	render() {
		let that = this;
		return (
			<div style={{backgroundColor:'#fff'}}>
				<Table columns={columns} dataSource={that.props.data} pagination={false} bordered={true} size='middle' />
			</div>
		)
	}
}






