import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Drawer,Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input ,Modal,message,List,Avatar,Select ,InputNumber} from 'antd';
import { getFormat } from '../../utils/tool';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import styles from './UserManage.less';

const FormItem = Form.Item;

@connect(({userInfo,loading})=>({
    allData:userInfo.allData,
    loading:loading.models.userInfo
}))
@Form.create()

export default class DynamicManage extends PureComponent{
    state = {
        selectedRows: [],
        formValues: {},
    };
    componentDidMount(){
        const { dispatch } = this.props;
         dispatch({
            type: 'userInfo/fetchAllDynamicInfo',
            payload:{
                currentPage:1,
                pageSize: 10,
            }
          })
    }
    //行单击事件
    handleOnClickRow=(record,rowkey)=>{

    }
    //选择表格项
    handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
    };

    //表格分页选择
    handleTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
        }, {});

        const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        };
    
        if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
        }
        dispatch({
            type: 'userInfo/fetchAllDynamicInfo',
            payload: params,
        });
        this.setState({
          selectedRows:[]
        })
    }

    //重置表单
    handleFormReset = () => {
        const { form, dispatch,allData:{pagination} } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        dispatch({
          type: 'userInfo/fetchAllDynamicInfo',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        });
    };

    //搜索
    handleSearch = e => {
        e.preventDefault();
        const { dispatch, form ,allData:{pagination}} = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const values = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...fieldsValue,
          };
          this.setState({
            formValues: values,
          });
          dispatch({
            type: 'userInfo/fetchAllDynamicInfo',
            payload: values,
          });
        });
    };

    //搜索表单
    renderForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        
        return (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="用户名">
                  {getFieldDecorator('Name')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </a> */}
                </span>
              </Col>
            </Row>
          </Form>
        );
    }

    render(){
        const tablColumn= [
            {
                title:'编号',
                dataIndex:'Id',
                key:'Id',
                width: 90,
                sorter:(a,b)=>a.Id-b.Id,
            },
            {
                title:'用户名称',
                dataIndex:'UserName',
                key:'UserName',
            },
            {
                title:'操作名称',
                dataIndex:'ModuleName',
                key:'ModuleName',
            },
            {
                title:'动态',
                dataIndex:'Dynamic',
                key:'Dynamic',
            },
            {
                title:'创建时间',
                dataIndex:'CreateTime',
                key:'CreateTime',
                width: 200,
                render:(time)=>(
                    <span>
                        {getFormat(time)}
                    </span>
                )
            }
        ]
        const {
            iconData,
            allData,
            loading,
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows} = this.state;
         
        return (
            <PageHeaderLayout title="动态管理">
                 <Row >
                    <div style={{marginTop:'20px',backgroundColor:'#fff',padding:'20px 24px',minHeight:'800px',marginBottom:'20px'}}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <StandardTable 
                                selectedRows={selectedRows}
                                data={formatData}
                                loading={loading}
                                onRowClick={this.handleOnClickRow}
                                onSelectRow={this.handleSelectRows}
                                onChange={this.handleTableChange}
                                columns={tablColumn}
                            />
                    </div>
               </Row>
            </PageHeaderLayout>
        );
    }
}

 