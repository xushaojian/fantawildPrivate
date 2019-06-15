import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input,Modal,Select,TreeSelect} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import TreeView from '../../components/TreeView/TreeView'
import { getFormat,getOptionList } from '../../utils/tool';
import styles from './UserManage.less';  

const FormItem = Form.Item;
const Option=Select.Option;
const confirm = Modal.confirm;

@connect(({sysUser,loading})=>({
    roleData:sysUser.roleData,
    treeData:sysUser.treeData,
    allData:sysUser.allData,
    loading:loading.models.sysUser
}))

@Form.create()

export default class UserManage extends PureComponent{
    state = {
        selectedRows: [],
        formValues: {},
        title:'',
        type:'',
        userModalVisible:false
      };
    componentDidMount(){
        const { dispatch } = this.props;
        //用户列表
        dispatch({
            type:'sysUser/fetch',
            payload:{
                currentPage:1,
                pageSize: 10,
            }
        })
        //部门树
        dispatch({
            type:'sysUser/fetchTree'
        })
        //角色名称列表
        dispatch({
            type:'sysUser/fetchRole'
        })
    }
    //行单击事件
    handleOnClickRow=(record,rowkey)=>{

    }

    handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
    };

    //还原密码
    resetPassword=()=>{
        var _this=this;
        const {selectedRows}=this.state;
        const { dispatch } = this.props;
        if(selectedRows.length<1){
            Modal.info({
                title:'用户管理',
                content:'请选择一行'
            })
            return;
        }
        confirm({
            title:'还原密码?',
            content:'点击确认，还原密码',
            onOk(){
                const ids=selectedRows.map(item=>item.Id);
                dispatch({
                    type:'sysUser/submitResetPwd',
                    payload:{
                        userId:ids.join(','),
                        currentPage:1,
                        pageSize: 10,
                    }
                })
                _this.setState({
                    selectedRows:[]
                })
            },
            onCancel(){
            }
        })
    }

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
            type: 'sysUser/fetch',
            payload: params,
        });
        this.setState({
            selectedRows:[]
        })
    }

    handleFormReset = () => {
        const { form, dispatch,allData:{pagination} } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        dispatch({
          type: 'sysUser/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        });
    };

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
            type: 'sysUser/fetch',
            payload: values,
          });
        });
    };

    renderForm() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        
        return (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="登录名">
                  {getFieldDecorator('AccountName')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="姓名">
                  {getFieldDecorator('RealName')(<Input placeholder="请输入" />)}
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

    handleSubmit=()=>{
        let {type}=this.state;
        const { dispatch,allData:{pagination} } = this.props;
        const action = type=="create" ? undefined : type;
        this.SysUserForm.props.form.validateFields((err, fieldsValue) => {
            console.log('err:',err);
            console.log('fieldsValue:',fieldsValue)
            if (err) return;
             
            dispatch({
                type: 'sysUser/submit',
                payload: { 
                    action,
                     ...fieldsValue, 
                    currentPage:pagination.current,
                    pageSize: pagination.pageSize, 
                },
            });
        })
        //重置表单    
        this.SysUserForm.props.form.resetFields();
        this.setState({
            userModalVisible:false,
            selectedRows:[]
        })
    }

    handleOperate=(type,obj)=>{
        const { dispatch,allData:{pagination}} = this.props;
        let options;
        switch(type){
          case 'create':{
              options={
                  ...this.state,
                  type,
                  title:'新建用户', 
                  selectedRows:[],
                  userModalVisible:true
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
                   title:'编辑用户', 
                   selectedRows:list,
                   userModalVisible:true
              }
              this.setState(options);
              break;
          }
          case 'delete':{
            var _this=this;
              const deleteList = this.state.selectedRows.map(item => item.Id);
              if(deleteList.length<1){
                  Modal.info({
                      title:'用户管理',
                      content:'请选择一行'
                  })
                  return;
              }else{
                  confirm({
                      title: '删除系统用户?',
                      content: '确认删除系统用户？',
                      okText:'确认',
                      cancelText:'取消',
                      onOk() {
                          dispatch({
                              type: 'sysUser/submit',
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

    onTreeSelect=key=>{
        const { dispatch,allData:{pagination}} = this.props;
        dispatch({
            type: 'sysUser/fetch',
            payload: { 
                departmentId:key[0],
                currentPage:pagination.current,
                pageSize:pagination.pageSize, 
            },
        });
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
                title:'登录名',
                dataIndex:'AccountName',
                key:'AccountName'
            },
            {
                title:'姓名',
                dataIndex:'RealName',
                key:'RealName'
            },
            {
                title:'工号',
                dataIndex:'GradeCode',
                key:'GradeCode'
            },
            {
                title:'部门',
                dataIndex:'DepartmentName',
                key:'DepartmentName'
            }
            ,
            {
                title:'角色',
                dataIndex:'RoleName',
                key:'RoleName'
            }
            ,
            {
                title:'说明',
                dataIndex:'Remarks',
                key:'Remarks'
            }
            ,
            {
                title:'最近登录时间',
                dataIndex:'LoginTime',
                key:'LoginTime',
                width: 200,
                render:(time)=>(
                    <span>
                        {getFormat(time)}
                    </span>
                )
            }
            ,
            {
                title:'操作',
                dataIndex:'Operation',
                key:'Operation',
                width: 80,
                render:(text,record)=>(
                    <a style={{color:'#5cbda8'}} onClick={()=>{
                        this.handleOperate('edit',record)
                    }}>编辑</a>
                )
            }
        ]
        const {
            allData,
            treeData,
            roleData,
            loading,
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows} = this.state;
         
        return (
            <PageHeaderLayout title="用户管理">
                <Modal title={this.state.title}
                 visible={this.state.userModalVisible}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.SysUserForm.props.form.resetFields();
                    this.setState({
                        userModalVisible:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消"
                 >
                    <SysUserForm type={this.state.type} treeData={treeData} sysUser={this.state.selectedRows[0]} roles={roleData} wrappedComponentRef={(inst)=>{this.SysUserForm=inst;}}></SysUserForm>
                </Modal>
                 <Row style={{minHeight:'800px',backgroundColor:'#fff'}}>
                    <Col span="5">
                        <div style={{ padding:'20px 24px',marginBottom:'20px',marginRight:'0px',borderRadius: '4px'}}>
                            <TreeView treeData={treeData} onTreeSelect={this.onTreeSelect}/>
                        </div>
                    </Col>
                    <Col span="19">
                        <div style={{padding:'20px 24px',marginBottom:'20px',borderRadius: '4px'}}>
                            <div style={{margin:'0px 10px 20px 0px',fontSize:'16px'}}>
                                <Icon type="user" ></Icon><span style={{marginLeft:'5px'}}>部门人员</span>
                            </div>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div style={{margin:'10px 10px'}}>
                                <Button icon="plus" type="primary" onClick={()=>{this.handleOperate('create')}} >新建</Button>
                                <Button type="danger" style={{marginLeft:'5px'}} icon="delete" onClick={()=>{this.handleOperate('delete')}} >删除</Button>
                                <Button type="Default" style={{marginLeft:'5px'}} icon="usergroup-add" onClick={this.resetPassword} >还原密码</Button>
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
                    </Col>
               </Row>
            </PageHeaderLayout>
        );
    }
}

class SysUserForm extends React.Component{
    state={
        value: undefined
    }
 
    onChange = (value) => {
        this.setState({ value });
    }

    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    let item={};
                    item.title=ele.Name;
                    item.value=ele.Id;
                    item.key=ele.Id;
                    item.DepartmentId=ele.DepartmentId;
                    item.children=this.mapData(ele.children);
                    return item;
                } else {
                    return {
                        title:ele.Name,
                        value:ele.Id,
                        key:ele.Id,
                        DepartmentId:ele.DepartmentId
                    };
                }
            })
        }
        return []
    }

    render(){
        const { form ,roles,treeData} = this.props;
        let treeList=[];
        treeData.map((ele,i)=>{
            let itemTree={};
            itemTree.title=ele.Name;
            itemTree.value=ele.Id;
            itemTree.key=ele.Id;
            itemTree.DepartmentId=ele.DepartmentId;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });
      
        let sysUser=this.props.sysUser||{};
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
            <FormItem label="用户ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysUser.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
           <FormItem label="部门" {...formItemLayout}>
                {
                    getFieldDecorator('DepartmentId',{
                        initialValue:sysUser.DepartmentId==null?null:sysUser.DepartmentId,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <TreeSelect
                            style={{ width: 350 }}
                            value={this.state.value}
                            dropdownStyle={{ maxHeight:300, overflow: 'auto' }}
                            treeData={treeList}
                            placeholder="请选择"
                            treeDefaultExpandAll
                            onChange={this.onChange}
                        />
                    )
                }
            </FormItem>
            <FormItem label="登录名" {...formItemLayout}>
                {
                    getFieldDecorator('AccountName',{
                        initialValue:sysUser.AccountName,
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
            <FormItem label="姓名" {...formItemLayout}>
                {
                    getFieldDecorator('RealName',{
                        initialValue:sysUser.RealName,
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
            <FormItem label="工号" {...formItemLayout}>
                {
                    getFieldDecorator('GradeCode',{
                        initialValue:sysUser.GradeCode,
                        rules:[
                            {
                                required:true,
                                message:'请输入正确的数字'
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入6位数字的工号" minLength={6} maxLength={6}></Input>
                    )
                }
            </FormItem>
            <FormItem label="角色" {...formItemLayout}>
                {
                    getFieldDecorator('RoleId',{
                        initialValue:sysUser.RoleId,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Select placeholder="请选择">
                            {getOptionList(roles)}
                        </Select>
                    )
                }
            </FormItem>
            <FormItem label="是否是主管" {...formItemLayout}>
                {
                    getFieldDecorator('IsMinister',{
                        initialValue:sysUser.IsMinister?"1":"0",
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Select placeholder="请输入">
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                    )
                }
            </FormItem>
            {
                sysUser.Password==undefined?<FormItem label="密码" {...formItemLayout}>
                {
                    getFieldDecorator('Password',{
                        initialValue:sysUser.Password,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Input type="password" placeholder="请输入" ></Input>
                    )
                }
            </FormItem>:null
            }
            <FormItem label="说明" {...formItemLayout}>
                {
                    getFieldDecorator('Remarks',{
                        initialValue:sysUser.Remarks==null?null:sysUser.Remarks,
                    })(
                        <Input type="text" placeholder="" maxLength={100}></Input>
                    )
                }
            </FormItem>
          </Form>
        );
    }
}

 SysUserForm=Form.create({})(SysUserForm);