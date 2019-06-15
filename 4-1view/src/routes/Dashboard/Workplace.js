import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Avatar } from 'antd';
import SourceTable from "components/SourceTable";
import { Bar, TimelineChart } from "components/Charts";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Workplace.less';
import Authorized from '../../utils/Authorized';
import { getAuthority, getUserInfo } from '../../utils/authority';


@connect(({ loading,  userInfo }) => ({
  userInfo,
  loading: loading.effects['userInfo/fetchUserInfo'],
}))

export default class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch({
      type: 'userInfo/fetchUserInfo'
    })
    dispatch({
      type: 'userInfo/fetchDynamicInfo'
    })
  }

  render() {

    const {
      userInfo: { basicInfo,dynamicData },
      loading,
    } = this.props;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{basicInfo.RoleName==undefined?'':basicInfo.RoleName}，祝你开心每一天！</div>
        </div>
      </div>
    );
    
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>新增报告</p>
          <p>{dynamicData.newReport}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Authorized >
              <Card
                className={styles.projectList}
                style={{ marginBottom: 24 }}
                title="最新动态"
                bordered={false}
                extra={<Link to="/log">全部动态</Link>}
                loading={loading}
              >
                <SourceTable data={dynamicData} styles={{ padding: 0 }} multipleSelection={loading} />
              </Card>
            </Authorized>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
