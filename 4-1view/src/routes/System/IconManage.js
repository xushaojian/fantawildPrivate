import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Drawer,Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input ,Modal,message,List,Avatar } from 'antd';
import CONFIG from '../../config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import styles from './UserManage.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({sysIcon,loading})=>({
    allData:sysIcon.allData,
    loading:loading.models.sysIcon
}))
@Form.create()
export default class IconManage extends PureComponent{
    state = {
        type:'',
        title:'',
        iconModalVisible:false,
        selectedRows: [],
        formValues: {},
    };
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type:'sysIcon/fetch',
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
            type: 'sysIcon/fetch',
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
          type: 'sysIcon/fetch',
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
            type: 'sysIcon/fetch',
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
                <FormItem label="图标名">
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
    onDrawerClose = () => {
        this.setState({
            drawerVisbile: false,
            drawerTiltle:''
        });
    };
    //提交数据
    handleSubmit=()=>{
        let {type}=this.state;
        const { dispatch,allData:{pagination} } = this.props;
        const action = type=="create" ? undefined : type;
        this.SysIconForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'sysIcon/submit',
                payload: { 
                    action,
                     ...fieldsValue, 
                    currentPage:pagination.current,
                    pageSize: pagination.pageSize, 
                },
            });
        })
        //重置表单    
        this.SysIconForm.props.form.resetFields();
        this.setState({
            iconModalVisible:false,
            selectedRows:[]
        })
    }

    //弹框操作
    handleOperate=(type,obj)=>{
          const { dispatch,allData:{pagination}} = this.props;
          let options;
          switch(type){
            case 'create':{
                options={
                    ...this.state,
                    type,
                    title:'新建图标', 
                    selectedRows:[],
                    iconModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'edit':{
                let list=[];
                list.push(obj);
                options={
                    ...this.state,
                     type,
                     title:'编辑图标', 
                     selectedRows:list,
                     iconModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'delete':{
                var _this=this;
                const deleteList = this.state.selectedRows.map(item => item.Id);
                if(deleteList.length<1){
                    Modal.info({
                        title:'图标管理',
                        content:'请选择一行'
                    })
                    return;
                }else{
                    confirm({
                        title: '删除系统图标?',
                        content: '确认删除系统图标？',
                        okText:'确认',
                        cancelText:'取消',
                        onOk() {
                            dispatch({
                                type: 'sysIcon/submit',
                                payload: { 
                                    action:type,
                                    id:deleteList.join(','),  
                                    currentPage:pagination.current,
                                    pageSize: pagination.pageSize, 
                                },
                            });
                            _this.setState({
                                selectedRows: [],
                            });
                        },
                        onCancel() {},
                    });
                }
                break;
            }
            default:
            break;
        }
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
                title:'图标名称',
                dataIndex:'IconName',
                key:'IconName',
              
            },
            {
                title:'图标CSS',
                dataIndex:'IconCssInfo',
                key:'IconCssInfo',
                render:(iconName)=>(
                    <span><Icon type={iconName}></Icon></span>
               )
            } 
            ,
            {
                title:'操作',
                dataIndex:'Operation',
                key:'Operation',
                width: 80,
                render:(text,record)=>(
                    <a  style={{color:'#5cbda8'}} onClick={()=>{
                        this.handleOperate('edit',record)
                    }}>编辑</a>
                )
            }
        ]
        const {
            allData,
            loading,
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows} = this.state;
         
        return (
            <PageHeaderLayout title="图标管理">
                 <Modal title={this.state.title}
                 visible={this.state.iconModalVisible}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.SysIconForm.props.form.resetFields();
                    this.setState({
                        iconModalVisible:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <SysIconForm type={this.state.type} sysIcon={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.SysIconForm=inst;}}></SysIconForm>
                </Modal>
                 <Row >
                    <div style={{marginTop:'10px',backgroundColor:'#fff',padding:'20px 24px',minHeight:'800px',marginBottom:'20px'}}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div style={{margin:'10px 10px'}}>
                                <Button icon="plus" type="primary" onClick={()=>{this.handleOperate('create')}} >新建</Button>
                                <Button type="danger" style={{marginLeft:'5px'}} icon="delete" onClick={()=>{this.handleOperate('delete')}} >删除</Button>
                            </div>
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

class SysIconForm extends React.Component{
    render(){
        const { form } = this.props;
        let sysIcon=this.props.sysIcon||{};
        const { getFieldDecorator } = form;
        const formItemLayout={
            labelCol: {
                xs: { span:5 },
              },
              wrapperCol: {
                xs: { span: 19 },
              }
        }
        const {RoleList} =this.props;
       return (
          <Form  layout="horizontal">
            <FormItem label="图标ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysIcon.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="图标名" {...formItemLayout}>
                {
                    getFieldDecorator('IconName',{
                        initialValue:sysIcon.IconName,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入" maxLength={50}></Input>
                    )
                }
            </FormItem>
            <FormItem label="图标css" {...formItemLayout}>
                {
                    getFieldDecorator('IconCssInfo',{
                        initialValue:sysIcon.IconCssInfo,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入" maxLength={50}></Input>
                    )
                }
            </FormItem>
           
          </Form>
        );
    }
}

SysIconForm=Form.create({})(SysIconForm);