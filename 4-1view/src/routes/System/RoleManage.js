import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Drawer,Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input ,Modal,message,List,Avatar  } from 'antd';
import CONFIG from '../../config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import TreeCheck from '../../components/TreeCheck/TreeCheck';
import styles from './UserManage.less';
import user from '../../assets/user.png'

const FormItem = Form.Item;
const confirm = Modal.confirm;


@connect(({sysRole,loading})=>({
    allData:sysRole.allData,
    treeData:sysRole.treeData,
    userData:sysRole.userData,
    roleMenuButtonData:sysRole.roleMenuButtonData,
    loading:loading.models.sysRole
}))
@Form.create()
export default class RoleManage extends PureComponent{
    state = {
        type:'',
        title:'',
        drawerTiltle:'',
        roleModalVisible:false,
        drawerVisbile:false,
        roleAuthorizeModal:false,
        selectedTree:[],
        selectedRows: [],
        roleMenuButton:[],
        formValues: {},
    };
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type:'sysRole/fetch',
            payload:{
                currentPage:1,
                pageSize: 10,
            }
        })

        dispatch({
            type:'sysRole/fetchTree',
        })
    }

    //行单击事件
    handleOnClickRow=(record,rowkey)=>{
        const { dispatch,userData:{userList} } = this.props;
        dispatch({
            type:'sysRole/fetchVRole',
            payload:{
              Id:record.Id
            }
        })

       this.setState({
        drawerTiltle:record.Name+'成员',
        drawerVisbile:true,
       })
    }

    //选择表格项
    handleSelectRows = rows => {
        const { dispatch } = this.props;
       if(rows.length>0){
            //菜单按钮列表
            dispatch({
                type:'sysRole/fetchRoleMenuButton',
                payload: { 
                    RoleId:rows[0].Id
                },
            })
       }
        this.setState({
          selectedRows: rows,
        });
    };

    //树形数据选择
    handleTreeSelect=(selectedkey,info)=>{
        let checkedkey=[...selectedkey,...info.halfCheckedKeys];
        this.setState({
            roleMenuButton:checkedkey,
            selectedTree:selectedkey
        });
    }

    //树形数据提交
    handleTreeSelectSubmit=()=>{
        const { selectedRows,roleMenuButton} =this.state;
        const { dispatch } = this.props;
        if(selectedRows.length>0){
            dispatch({
                type:'sysRole/submitPermission',
                payload:{
                    currentPage:1,
                    pageSize: 10,
                    RoleId:selectedRows[0].Id,
                    PermissionIds:roleMenuButton.join(',')
                }
            })
        }
        this.setState({
            roleAuthorizeModal:false,
            selectedRows:[]
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
            type: 'sysRole/fetch',
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
          type: 'sysRole/fetch',
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
            type: 'sysRole/fetch',
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
                <FormItem label="角色名">
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
        this.SysRoleForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'sysRole/submit',
                payload: { 
                    action,
                     ...fieldsValue, 
                    currentPage:pagination.current,
                    pageSize: pagination.pageSize, 
                },
            });
        })
        //重置表单    
        this.SysRoleForm.props.form.resetFields();
        this.setState({
            roleModalVisible:false,
            selectedRows:[]
        })
    }

    //弹框操作
    handleOperate=(type)=>{
          const { dispatch,allData:{pagination}} = this.props;
          let options;
          switch(type){
            case 'create':{
                options={
                    ...this.state,
                    type,
                    title:'新建角色', 
                    selectedRows:[],
                    roleModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'edit':{
                const {selectedRows}=this.state;
                if(selectedRows.length<1){
                    Modal.info({
                        title:'角色管理',
                        content:'请选择一行'
                    })
                    return;
                }else if(selectedRows.length>1){
                    Modal.info({
                        title:'角色管理',
                        content:'不支持批量操作'
                    })
                    return;
                }
                let list=[];
                list.push(selectedRows[0]);
                options={
                    ...this.state,
                     type,
                     title:'编辑角色', 
                     selectedRows:list,
                     roleModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'delete':{
                var _this=this;
                const deleteList = this.state.selectedRows.map(item => item.Id);
                if(deleteList.length<1){
                    Modal.info({
                        title:'角色管理',
                        content:'请选择一行'
                    })
                    return;
                }else{
                    confirm({
                        title: '删除系统角色?',
                        content: '确认删除系统角色？',
                        okText:'确认',
                        cancelText:'取消',
                        onOk() {
                            dispatch({
                                type: 'sysRole/submit',
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

    /**权限维护 */
    handleRoleAuthorize=()=>{
        const {selectedRows}=this.state;
        if(selectedRows.length>1){
            Modal.info({
                title:'权限管理',
                content:'不支持批量操作'
            })
            return;
        }else if(selectedRows.length<1){
            Modal.info({
                title:'权限管理',
                content:'请选择角色'
            })
            return;
        }
        const {
            roleMenuButtonData
        }=this.props;
        let menuButtonList=[];
        if(roleMenuButtonData.length>0){
            roleMenuButtonData.map(item=>{
               if(item.ParentId==0){
                 menuButtonList.push(item.Name);
               }else{
                 menuButtonList.push(item.MenuId+":"+item.Name);
               }
            });
        } 
        this.setState({
            roleAuthorizeModal:true,
            selectedTree:menuButtonList,
            roleMenuButton:menuButtonList
        })
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
                title:'角色名称',
                dataIndex:'Name',
                key:'Name'
            },
            {
                title:'角色描述',
                dataIndex:'Description',
                key:'Description'
            } 
           
        ]
        const {
            allData,
            treeData,
            loading,
            userData:{userList},
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows} = this.state;
         console.log('treeData:',treeData);
        return (
            <PageHeaderLayout title="角色管理">
                 <Modal title={this.state.title}
                 visible={this.state.roleModalVisible}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.SysRoleForm.props.form.resetFields();
                    this.setState({
                        roleModalVisible:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <SysRoleForm type={this.state.type} sysRole={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.SysRoleForm=inst;}}></SysRoleForm>
                </Modal>

                <Modal title="角色授权"
                 visible={this.state.roleAuthorizeModal}
                 onOk={this.handleTreeSelectSubmit}
                 onCancel={()=>{
                    this.setState({
                        roleAuthorizeModal:false,
                        selectedTree:[],
                        roleMenuButton:[]
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                       <TreeCheck treeData={treeData} roleMenuButtonData={this.state.selectedTree}  onTreeSelect={this.handleTreeSelect}/>
                </Modal>
                 <Row >
                        <div style={{marginTop:'10px',backgroundColor:'#fff',padding:'20px 24px',minHeight:'835px',marginBottom:'20px',borderRadius: '4px'}}>
                        <div>
                            <Drawer
                            title={this.state.drawerTiltle}
                            placement="right"
                            onClose={this.onDrawerClose}
                            visible={this.state.drawerVisbile}
                            >
                                 <List
                                    itemLayout="horizontal"
                                    dataSource={userList}
                                    renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                        avatar={<Avatar src={user}/>}
                                        title={<a href="#">{item.RealName}</a>}
                                        description=""
                                        />
                                    </List.Item>
                                    )}
                                />
                            </Drawer>
                        </div>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div style={{margin:'10px 10px',display:'inline-block'}}>
                                <Button icon="plus" type="primary" onClick={()=>{this.handleOperate('create')}} >新建</Button>
                                <Button type="danger" style={{marginLeft:'5px'}} icon="delete" onClick={()=>{this.handleOperate('delete')}} >删除</Button>
                                <Button type="Default" style={{marginLeft:'5px'}} icon="lock" onClick={this.handleRoleAuthorize} >权限维护</Button>
                            </div>
                            <div style={{float:'right',display:'inline-block'}}>
                                <Button type="edit" style={{marginLeft:'5px'}} icon="edit" onClick={()=>{this.handleOperate('edit')}} >编辑</Button>
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

class SysRoleForm extends React.Component{
    render(){
        const { form } = this.props;
        let sysRole=this.props.sysRole||{};
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
            <FormItem label="角色ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysRole.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="角色名" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:sysRole.Name,
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
            <FormItem label="描述" {...formItemLayout}>
                {
                    getFieldDecorator('Description',{
                        initialValue:sysRole.Description==null?null:sysRole.Description,
                    })(
                        <Input type="text" placeholder="请输入" maxLength={100}></Input>
                    )
                }
            </FormItem>
           
          </Form>
        );
    }
}

SysRoleForm=Form.create({})(SysRoleForm);