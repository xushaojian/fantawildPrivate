import React,{PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Row,Table,Button,Form,Modal,Input,TreeSelect,InputNumber,message,Select} from 'antd';
import {connect} from 'dva';
import {arrayMax} from '../../utils/tool';
import { getFormat,getUserOptionList } from '../../utils/tool';
import styles from './UserManage.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option=Select.Option;

@connect(({userDepartment,loading})=>({
    userData:userDepartment.userData,
    treeData:userDepartment.treeData,
    loading:loading.models.userDepartment
}))

export default class DepartmentManage extends PureComponent{
    state = {
        type:'',
        title:'',
        departmentModal:false,
        selectedRows: [],
        formValues: {},
    };
    componentDidMount(){
        this.props.dispatch({
            type:'userDepartment/fetchTree',
        })
    }

    //行单击事件
    handleOnClickRow=(record,rowkey)=>{

    }

    //部门树形菜单
    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    let item={};
                    item.key=ele.Id;
                    item.Id=ele.Id;
                    item.Name=ele.Name;
                    item.Sort=ele.Sort;
                    item.MinisterUserId=ele.MinisterUserId;
                    item.MemberNum=ele.MemberNum;
                    item.ParentId=ele.ParentId;
                    item.MinisterUserName=ele.MinisterUserName;
                    item.children=this.mapData(ele.children);
                    return item;
                } else {
                    return {
                        key:ele.Id,
                        Id:ele.Id,
                        Name:ele.Name,
                        Sort:ele.Sort,
                        MemberNum:ele.MemberNum,
                        MinisterUserId:ele.MinisterUserId,
                        MinisterUserName:ele.MinisterUserName
                    };
                }
            })
        }
        return []
    }

    //提交数据
    handleSubmit=()=>{
        var _this=this;
        let {type}=this.state;
        let selectedRows=[];
        const { dispatch,treeData } = this.props;
        const action = type=="create" ? undefined : type;
        this.DepartmentForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'userDepartment/submit',
                payload: { 
                    action,
                     ...fieldsValue, 
                },
            });
            _this.setState({
                departmentModal:false,
                selectedRows:[...selectedRows]
            })
        })
        //重置表单  
        this.DepartmentForm.props.form.resetFields();
    }

     //弹框操作
     handleOperate=(type,obj)=>{
        const { dispatch} = this.props;
        let options;
        switch(type){
          case 'create':{
            options={
                ...this.state,
                type,
                title:'添加部门', 
                selectedRows:[],
                departmentModal:true
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
                 title:'编辑部门', 
                 selectedRows:list,
                 departmentModal:true
            }
            this.setState(options);
            break;
          }
          case 'delete':{
            var _this=this;
            const memberNumList=this.state.selectedRows.map(item => item.MemberNum);
            const deleteList = this.state.selectedRows.map(item => item.key);
            if(deleteList.length<1){
                Modal.info({
                    title:'部门管理',
                    content:'请选择一行'
                })
                return;
            }else{
                var memberNumMax=arrayMax(memberNumList);
                if(memberNumMax>0){
                    message.warning('该部门或其子部门下有员工，不可被删除!',5);
                    return;
                }
                confirm({
                    title: '删除部门信息?',
                    content: '确认删除部门信息？',
                    okText:'确认',
                    cancelText:'取消',
                    onOk() {
                        dispatch({
                            type: 'userDepartment/submit',
                            payload: { 
                                action:type,
                                id:deleteList.join(',')  
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
        const columns = [{
            title: '部门名称',
            dataIndex: 'Name',
            key: 'Name',
          }, {
            title: '排序',
            dataIndex: 'Sort',
            key: 'Sort',
            width: '12%',
          }, {
            title: '成员数',
            dataIndex: 'MemberNum',
            key: 'MemberNum',
            width: '12%',
          }, {
            title: '主管',
            dataIndex: 'MinisterUserName',
            width: '30%',
            key: 'MinisterUserName',
          },{
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
        ];

          const {
            userData,
            treeData,
            loading,
        } = this.props;  
    
        let treeList=[];
        treeData.map((ele,i)=>{
            let itemTree={};
            itemTree.key=ele.Id;
            itemTree.Id=ele.Id;
            itemTree.Name=ele.Name;
            itemTree.Sort=ele.Sort;
            itemTree.MemberNum=ele.MemberNum;
            itemTree.ParentId=ele.ParentId;
            itemTree.MinisterUserName=ele.MinisterUserName;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(selectedRows);
                this.setState({
                    selectedRows: selectedRows,
                  });
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log(selected, selectedRows, changeRows);
            },
        };
        
        return (
            <PageHeaderLayout title="部门管理">
                <Modal title={this.state.title}
                 visible={this.state.departmentModal}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.DepartmentForm.props.form.resetFields();
                    this.setState({
                        departmentModal:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <DepartmentForm type={this.state.type} treeData={treeData} users={userData} userDepartment={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.DepartmentForm=inst;}}></DepartmentForm>
                </Modal>
                <Row>
                    <div className={styles.tableLayout} >
                            <div style={{margin:'10px 10px',display:'inline-block'}}>
                                <Button icon="plus" type="primary" onClick={()=>{this.handleOperate('create')}} >添加部门</Button>
                            </div>
                            <div style={{float:'right',display:'inline-block'}}>
                                    <Button type="danger" style={{marginLeft:'5px'}} icon="delete" onClick={()=>{this.handleOperate('delete')}} >删除</Button>
                            </div>
                        <Table columns={columns} rowSelection={rowSelection} dataSource={treeList} loading={loading} defaultExpandAllRows={true}  />
                    </div>
                </Row>
            </PageHeaderLayout>
        );
    }
}

class DepartmentForm extends React.Component{
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
                    item.ParentId=ele.ParentId;
                    item.children=this.mapData(ele.children);
                    return item;
                } else {
                    return {
                        title:ele.Name,
                        value:ele.Id,
                        key:ele.Id
                    };
                }
            })
        }
        return []
    }
    render(){
        const { form,treeData,users} = this.props;
        let treeList=[];
        treeData.map((ele,i)=>{
            let itemTree={};
            itemTree.title=ele.Name;
            itemTree.value=ele.Id;
            itemTree.key=ele.Id;
            itemTree.ParentId=ele.ParentId;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });

        let userDepartment=this.props.userDepartment||{};
        const { getFieldDecorator } = form;
        const formItemLayout={
            labelCol: {
                xs: { span:5 },
              },
              wrapperCol: {
                xs: { span: 19 },
              }
        }
      
       return (
          <Form  layout="horizontal">
           <FormItem label="部门ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:userDepartment.Id, 
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="部门名称" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:userDepartment.Name,
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
            <FormItem label="部门负责人" {...formItemLayout}>
                {
                    getFieldDecorator('MinisterUserId',{
                        initialValue:userDepartment.MinisterUserId,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Select placeholder="请选择">
                            {getUserOptionList(users)}
                        </Select>
                    )
                }
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
                {
                    getFieldDecorator('Sort',{
                        initialValue:userDepartment.Sort==null?1:userDepartment.Sort,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <InputNumber min={1} max={1000}  ></InputNumber>
                    )
                }
            </FormItem>
            <FormItem label="上级部门" {...formItemLayout}>
                {
                    getFieldDecorator('ParentId',{
                        initialValue:userDepartment.ParentId==null||userDepartment.ParentId==0?'父节点':userDepartment.ParentId,
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
                        placeholder="父节点"
                        treeDefaultExpandAll
                        onChange={this.onChange}
                    />
                    )
                }
            </FormItem>
           
          </Form>
        );
    }
}

DepartmentForm=Form.create({})(DepartmentForm);