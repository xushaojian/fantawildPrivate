import React,{PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Row,Table,Button,Form,Modal,Input,TreeSelect,InputNumber,message,Select,Icon } from 'antd';
import {connect} from 'dva';
import {arrayMax} from '../../utils/tool';
import StandardTable from "components/StandardTable";
import styles from './UserManage.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option=Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@connect(({sysMenu,loading})=>({
    menuLength:sysMenu.menuLength,
    menuButtonData:sysMenu.menuButtonData,
    buttonData:sysMenu.buttonData,
    iconData:sysMenu.iconData,
    treeData:sysMenu.treeData,
    loading:loading.models.sysMenu
}))
export default class MenuManage extends PureComponent{
    state = {
        type:'',
        title:'',
        menuModal:false,
        selectedRows: [],
        formValues: {},
        menuButtonModal:false,
        menuButtonData:[],
    };
    componentDidMount(){
        const { dispatch } = this.props;
        //菜单树
        dispatch({
            type:'sysMenu/fetchTree',
        })
        //图标列表
        dispatch({
            type:'sysMenu/fetchIcon'
        })
        //按钮列表
        dispatch({
            type:'sysMenu/fetchButton'
        })
        
    }
     //行单击事件
    handleOnClickRow=(record,rowkey)=>{

    }

    //Menu树形菜单
    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    let item={};
                    item.key=ele.Id;
                    item.Id=ele.Id,
                    item.name=ele.name;
                    item.icon=ele.icon;
                    item.sort=ele.sort;
                    item.path=ele.path;
                    item.parentId=ele.parentId;
                    item.children=this.mapData(ele.children);
                    return item;
                } else {
                    return {
                        key:ele.Id,
                        Id:ele.Id,
                        name:ele.name,
                        icon:ele.icon,
                        sort:ele.sort,
                        path:ele.path
                    };
                }
            })
        }
        return []
    }

    //提交数据
    handleSubmit=()=>{
        let {type}=this.state;
        let selectedRows=[];
        const { dispatch,treeData } = this.props;
        const action = type=="create" ? undefined : type;
        this.MenuForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'sysMenu/submit',
                payload: { 
                    action, 
                     ...fieldsValue, 
                },
            });
        })
        //重置表单    
        this.MenuForm.props.form.resetFields();
        this.setState({
            menuModal:false,
            selectedRows:[...selectedRows]
        },()=>{
            console.log('触发回调函数');
        })
    }

    //分配按钮
    handleButtonSubmit=()=>{
        const { dispatch } = this.props;
        this.MenuButtonForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            let fileds={...fieldsValue};
            let buttonId=fileds.ButtonId.join(',');
            dispatch({
                type: 'sysMenu/submitButton',
                payload: { 
                     ...fieldsValue, 
                     ButtonId:buttonId
                },
            });
        })

        //重置表单    
        this.MenuButtonForm.props.form.resetFields();
        this.setState({
            menuButtonModal:false
        })
    }

    handleButtonOperate=()=>{
        const {selectedRows}=this.state;
        if(selectedRows.length<1){
            Modal.info({
                title:'分配按钮',
                content:'请选择一行'
            })
            return;
        }else if(selectedRows.length>1){
            Modal.info({
                title:'分配按钮',
                content:'不支持批量操作'
            })
            return;
        }
        const {
            menuButtonData
        }=this.props;

        
        this.setState({
            menuButtonModal:true,
            menuButtonData
        });
       
    }

     //弹框操作
    handleOperate=(type,obj)=>{
        const {dispatch} = this.props;
        let options;
        switch(type){
          case 'create':{
            options={
                ...this.state,
                type,
                title:'添加菜单', 
                selectedRows:[],
                menuModal:true
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
                 title:'编辑菜单', 
                 selectedRows:list,
                 menuModal:true
            }
            this.setState(options);
              break;
          }
          case 'delete':{
            var _this=this;
            const{selectedRows} =this.state;
        
            if(selectedRows.length<1) {
                Modal.info({
                    title:'菜单管理',
                    content:'请选择一行'
                })
                return;
            }
            if(selectedRows.length>1) {
                Modal.info({
                    title:'菜单管理',
                    content:'菜单不支持批量删除!'
                })
                return;
            }
            const {
                menuLength
            }=this.props;
            if(menuLength>0) {
                message.warning('该菜单下有子菜单，不允许删除!',5);
                return;
            }
            const deleteList = selectedRows.map(item => item.key);
            confirm({
                title: '删除菜单信息?',
                content: '确认删除菜单信息？',
                okText:'确认',
                cancelText:'取消',
                onOk() {
                    dispatch({
                        type: 'sysMenu/submit',
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
              break;
          }
          default:
          break;
      }
    }

    render(){
        const columns = [{
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
          },{
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            width: '12%',
          }, {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            width: '12%',
            render:(iconName)=>(
                 <span><Icon type={iconName}></Icon></span>
            )
          },{
            title: '路径',
            dataIndex: 'path',
            key: 'path',
            width: '12%',
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
            iconData,
            treeData,
            loading,
            buttonData,
        } = this.props;  

        let treeList=[];
        treeData.map(ele=>{
            let itemTree={};
            itemTree.key=ele.Id;
            itemTree.Id=ele.Id;
            itemTree.name=ele.name;
            itemTree.icon=ele.icon;
            itemTree.sort=ele.sort;
            itemTree.path=ele.path;
            itemTree.parentId=ele.parentId;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });
     
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                const { dispatch } = this.props;
                if(selectedRows.length>0){
                    //菜单按钮列表
                    dispatch({
                        type:'sysMenu/fetchMenuButton',
                        payload: { 
                            MenuId:selectedRowKeys[0]
                        },
                    })
                }
                this.setState({
                    selectedRows: selectedRows,
                  });
            },
            onSelect: (record, selected, selectedRows) => {
                
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            },
        };
        return (
            <PageHeaderLayout title="菜单管理">
                <Modal title={this.state.title}
                 visible={this.state.menuModal}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.MenuForm.props.form.resetFields();
                    this.setState({
                        menuModal:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <MenuForm type={this.state.type} icons={iconData} treeData={treeData} sysMenu={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.MenuForm=inst;}}></MenuForm>
                </Modal>
                <Modal title="分配按钮"
                 visible={this.state.menuButtonModal}
                 onOk={this.handleButtonSubmit}
                 onCancel={()=>{
                    this.MenuButtonForm.props.form.resetFields();
                    this.setState({
                        menuButtonModal:false,
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <MenuButtonForm type={this.state.type}  buttonData={buttonData} menuButtonData={this.state.menuButtonData} sysMenuButton={this.state.selectedRows[0]} wrappedComponentRef={(inst)=>{this.MenuButtonForm=inst;}}></MenuButtonForm>
                </Modal>
                <Row >
                    <div className={styles.tableLayout}>
                            <div style={{margin:'10px 10px',display:'inline-block'}}>
                                <Button icon="plus" type="primary" onClick={()=>{this.handleOperate('create')}} >添加菜单</Button>
                                <Button type="Default" style={{marginLeft:'5px'}} icon="usergroup-add" onClick={this.handleButtonOperate} >分配按钮</Button>
                            </div>
                            <div style={{float:'right',display:'inline-block'}}>
                                    <Button type="danger" style={{marginLeft:'5px'}} icon="delete" onClick={()=>{this.handleOperate('delete')}} >删除</Button>
                            </div>
                        <Table columns={columns} rowSelection={rowSelection} dataSource={treeList} loading={loading} defaultExpandAllRows={true}/>
                    </div>
                </Row>
            </PageHeaderLayout>
        );
    }
}

class MenuForm extends React.Component{
    state={
        value: undefined
    }
    onChange = (value) => {
        this.setState({ value });
    }
    getOptionList=(data)=>{
        if(!data){
            return [];
        }
        let options=[];
        data.map((item,i)=>{
            options.push(<Option value={item.IconName} key={item.Id}><Icon type={item.IconCssInfo}></Icon> {item.IconName}</Option>)
        });
        return options;
    }
    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    let item={};
                    item.title=ele.name;
                    item.value=ele.Id;
                    item.key=ele.Id;
                    item.parentId=ele.parentId;
                    item.children=this.mapData(ele.children);
                    return item;
                } else {
                    return {
                        title:ele.name,
                        value:ele.Id,
                        key:ele.Id
                    };
                }
            })
        }
        return []
    }
    render(){
        const { form,treeData,icons} = this.props;
        let treeList=[];
        treeData.map((ele,i)=>{
            let itemTree={};
            itemTree.title=ele.name;
            itemTree.value=ele.Id;
            itemTree.key=ele.Id;
            itemTree.parentId=ele.parentId;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });

        let sysMenu=this.props.sysMenu||{};
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
            <FormItem label="菜单ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysMenu.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
             <FormItem label="菜单名称" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:sysMenu.name,
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
            <FormItem label="父节点" {...formItemLayout}>
                {
                    getFieldDecorator('ParentId',{
                        initialValue:sysMenu.parentId==null||sysMenu.parentId==0?'父节点':sysMenu.parentId,
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
            <FormItem label="路径" {...formItemLayout}>
                {
                    getFieldDecorator('Path',{
                        initialValue:sysMenu.path,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入" ></Input>
                       
                    )
                }
            </FormItem>
            <FormItem label="图标" {...formItemLayout}>
                {
                    getFieldDecorator('Icon',{
                        initialValue:sysMenu.icon,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Select placeholder="请选择">
                            {this.getOptionList(icons)}
                        </Select>
                    )
                }
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
                {
                    getFieldDecorator('Sort',{
                        initialValue:sysMenu.sort==null?1:sysMenu.sort,
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
          </Form>
        );
    }
}

MenuForm=Form.create({})(MenuForm);

class MenuButtonForm extends React.Component{
    state={
        value: []
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
        const { 
            form,
            buttonData,
            menuButtonData
        } = this.props;
        let buttonList=[];
        if(menuButtonData.length>0){
            buttonList=menuButtonData.map(item=>item.ButtonId);
        } 
        let treeList=[];
        buttonData.map((ele,i)=>{
            let itemTree={};
            itemTree.title=ele.Name;
            itemTree.value=ele.Id;
            itemTree.key=ele.Id;
            itemTree.children= this.mapData(ele.children);
            treeList.push(itemTree);
            return treeList;
        });

        let sysMenuButton=this.props.sysMenuButton||{};
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
             <FormItem label="菜单名称" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:sysMenuButton.name,
                        rules:[
                            {
                                required:true,
                                message:'参数不能为空'
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="按钮" {...formItemLayout}>
                {
                    getFieldDecorator('ButtonId',{
                        initialValue:buttonList 
                    })(
                        <TreeSelect
                        value={buttonList}
                        treeCheckable={true} 
                        showCheckedStrategy= {SHOW_PARENT}
                        dropdownStyle={{ maxHeight:300, overflow: 'auto' }}
                        treeData={treeList}
                        placeholder="请选择"
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

MenuButtonForm=Form.create({})(MenuButtonForm);