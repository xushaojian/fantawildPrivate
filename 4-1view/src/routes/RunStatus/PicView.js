import React from 'react';
import { Card,Row, Col } from 'antd';

class PicView extends React.Component {
	constructor() {
		super();
		this.state = {

		};
	}
	render() {
		return (
			<div>
				<Row justify='start'>
					<Col span={6} style={{marginBottom:'40px'}}>
						<Card size="small" title="南宁-东盟神话-拉玛传奇" extra={<div style={{ color: '#6495ED' }}>运营中</div>} style={{ width: 350,borderRadius:'7px',backgroundColor:'#F0F8FF' }} headStyle={{borderRadius:'7px 7px 0px 0px'}}>
							<p>开机时间</p>
							<p>停机时间</p>
							<p>运行场次</p>
							<p>更新时间</p>
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}

export default () => (<PicView />);