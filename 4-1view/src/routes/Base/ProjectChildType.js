import React,{PureComponent} from 'react';
import {connect} from 'dva';
import axios from 'axios';
import {Drawer,Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input ,Modal,message,List,Avatar } from 'antd';
import CONFIG from '../../config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import styles from './Park.less';
const FormItem = Form.Item;
const confirm = Modal.confirm;
@connect(({project,loading})=>({
    allData:project.allData,
    loading:loading.models.project
}))
@Form.create()
export default class ProjectChildType extends PureComponent{
    state = {
        type:'',
        title:'',
        projectModalVisible:false,
        selectedRows: [],
        formValues: {},
    };
    
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type:'project/fetchChildType',
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
            type: 'project/fetchChildType',
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
          type: 'project/fetchChildType',
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
            type: 'project/fetchChildType',
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
                <FormItem label="项目子类型名">
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
        this.ProjectChildTypeForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'project/submitChildType',
                payload: { 
                    action,
                     ...fieldsValue, 
                    currentPage:pagination.current,
                    pageSize: pagination.pageSize, 
                },
            });
        })
        //重置表单    
        this.ProjectChildTypeForm.props.form.resetFields();
        this.setState({
            projectModalVisible:false,
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
                    title:'新建项目子类型', 
                    selectedRows:[],
                    projectModalVisible:true
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
                     title:'编辑项目子类型', 
                     selectedRows:list,
                     projectModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'delete':{
                var _this=this;
                const deleteList = this.state.selectedRows.map(item => item.Id);
                if(deleteList.length<1){
                    Modal.info({
                        title:'项目管理',
                        content:'请选择一行'
                    })
                    return;
                }else{
                    confirm({
                        title: '删除项目子类型?',
                        content: '确认删除项目子类型？',
                        okText:'确认',
                        cancelText:'取消',
                        onOk() {
                            dispatch({
                                type: 'project/submitChildType',
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
                title:'序号',
                dataIndex:'Id',
                key:'Id',
                width: 90,
                sorter:(a,b)=>a.Id-b.Id,
            },
            {
                title:'项目子类型',
                dataIndex:'Name',
                key:'Name',
              
            },
            {
                title:'说明',
                dataIndex:'ChildTypeInfo',
                key:'ChildTypeInfo',
            }, 
            {
                title:'操作',
                dataIndex:'Operation',
                key:'Operation',
                width: 80,
                render:(text,record)=>(
                    <span>
                        <a onClick={()=>{
                                 this.handleOperate('edit',record)
                            }}>编辑</a>
                    </span>
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
            <Card >
                  <Modal title={this.state.title}
                 visible={this.state.projectModalVisible}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.ProjectChildTypeForm.props.form.resetFields();
                    this.setState({
                        projectModalVisible:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <ProjectChildTypeForm type={this.state.type} sysProject={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.ProjectChildTypeForm=inst;}}></ProjectChildTypeForm>
                </Modal>
                 <Row >
                    <div style={{marginTop:'20px',backgroundColor:'#fff',padding:'20px 24px',minHeight:'800px',marginBottom:'20px'}}>
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
            </Card>
        );
    }
}

class ProjectChildTypeForm extends React.Component{
    render(){
        const { form } = this.props;
        let sysProject=this.props.sysProject||{};
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
             <FormItem label="项目子类型ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysProject.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="项目子类型" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:sysProject.Name,
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
            <FormItem label="说明" {...formItemLayout}>
                {
                    getFieldDecorator('ChildTypeInfo',{
                        initialValue:sysProject.ChildTypeInfo==null?null:sysProject.ChildTypeInfo,
                    })(
                        <Input type="text" placeholder="请输入" maxLength={100}></Input>
                    )
                }
            </FormItem>
           
          </Form>
        );
    }
}
ProjectChildTypeForm=Form.create({})(ProjectChildTypeForm);