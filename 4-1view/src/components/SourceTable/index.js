// 显示资源列表。有两种不同的显示风格
import React, { PureComponent } from "react";
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Table,
  Badge,
} from 'antd';
import StandardTable from '../StandardTable';

 
// 表格单元
const columns = [{
  title: '创建时间',
  dataIndex: 'CreateTime',
  key: 'CreateTime',
  render: val => moment(val).format('YYYY-MM-DD'),
}, {
  title: '用户',
  align: 'center',
  dataIndex: 'UserName',
  key: 'UserName',
}, {
  title: '操作名称',
  dataIndex: 'ModuleName',
  align: 'center',
  key: 'ModuleName',
}, {
  title: '动态',
  dataIndex: 'Dynamic',
  key: 'Dynamic',
},];



export default class SourceTable extends PureComponent {

  renderTable = () => {
    const {
      data: { list },
      loading,
    } = this.props;
    return <Table loading={loading} dataSource={list} columns={columns} styles={{ padding: 0 }} pagination={false} />;
  }

  renderStandardTable = () => {
    return <StandardTable {...this.props} columns={columns} />
  }
  
  render() {
    const { multipleSelection } = this.props;
    return multipleSelection ? this.renderStandardTable() : this.renderTable();
  }
}