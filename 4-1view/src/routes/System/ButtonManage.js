import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Drawer,Card,Row,Button,Tooltip,Icon,Divider,Form,Col ,Input ,Modal,message,List,Avatar,Select ,InputNumber} from 'antd';
import { getFormat } from '../../utils/tool';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import styles from './UserManage.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option=Select.Option;

@connect(({sysButton,loading})=>({
    iconData:sysButton.iconData,
    allData:sysButton.allData,
    loading:loading.models.sysButton
}))
@Form.create()

export default class ButtonManage extends PureComponent{
    state = {
        type:'',
        title:'',
        buttonModalVisible:false,
        selectedRows: [],
        formValues: {},
    };
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type:'sysButton/fetch',
            payload:{
                currentPage:1,
                pageSize: 10,
            }
        })
         //图标列表
         dispatch({
            type:'sysButton/fetchIcon'
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
            type: 'sysButton/fetch',
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
          type: 'sysButton/fetch',
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
            type: 'sysButton/fetch',
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
                <FormItem label="按钮名">
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
  
    //提交数据
    handleSubmit=()=>{
        let {type}=this.state;
        const { dispatch,allData:{pagination} } = this.props;
        const action = type=="create" ? undefined : type;
        this.SysButtonForm.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'sysButton/submit',
                payload: { 
                    action,
                     ...fieldsValue, 
                    currentPage:pagination.current,
                    pageSize: pagination.pageSize, 
                },
            });
        })
        //重置表单    
        this.SysButtonForm.props.form.resetFields();
        this.setState({
            buttonModalVisible:false,
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
                    title:'新建按钮', 
                    selectedRows:[],
                    buttonModalVisible:true
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
                     title:'编辑按钮', 
                     selectedRows:list,
                     buttonModalVisible:true
                }
                this.setState(options);
                break;
            }
            case 'delete':{
                var _this=this;
                const deleteList = this.state.selectedRows.map(item => item.Id);
                if(deleteList.length<1){
                    Modal.info({
                        title:'按钮管理',
                        content:'请选择一行'
                    })
                    return;
                }else{
                    confirm({
                        title: '删除系统按钮?',
                        content: '确认删除系统按钮？',
                        okText:'确认',
                        cancelText:'取消',
                        onOk() {
                            dispatch({
                                type: 'sysButton/submit',
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
                title:'按钮名称',
                dataIndex:'Name',
                key:'Name',
                render:(iconName)=>(
                    <span><Icon type={iconName}></Icon>{iconName}</span>
               )
            },
            {
                title:'按钮名称',
                dataIndex:'Icon',
                key:'Icon',
                render:(iconName)=>(
                    <span><Icon type={iconName}></Icon>{iconName}</span>
               )
            },
            {
                title:'排序',
                dataIndex:'Sort',
                key:'Sort'
            }  ,
            {
                title:'更新时间',
                dataIndex:'UpdateTime',
                key:'UpdateTime',
                width: 200,
                render:(time)=>(
                    <span>
                        {getFormat(time)}
                    </span>
                )
            }
            ,
            {
                title:'更新人',
                dataIndex:'UpdateBy',
                key:'UpdateBy',
                width: 200,
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
            iconData,
            allData,
            loading,
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows} = this.state;
         
        return (
            <PageHeaderLayout title="按钮管理">
                 <Modal title={this.state.title}
                 visible={this.state.buttonModalVisible}
                 onOk={this.handleSubmit}
                 onCancel={()=>{
                    this.SysButtonForm.props.form.resetFields();
                    this.setState({
                        buttonModalVisible:false
                    })
                 }}
                 okText="确定"
                 cancelText="取消">
                    <SysButtonForm type={this.state.type} icons={iconData} sysButton={this.state.selectedRows[0]}  wrappedComponentRef={(inst)=>{this.SysButtonForm=inst;}}></SysButtonForm>
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

class SysButtonForm extends React.Component{
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
    render(){
        const { form,icons } = this.props;
        let sysButton=this.props.sysButton||{};
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
             <FormItem label="按钮ID" {...formItemLayout} style={{display:'none'}}>
                {
                    getFieldDecorator('Id',{
                        initialValue:sysButton.Id,
                    })(
                        <Input type="text" placeholder="请输入"></Input>
                    )
                }
            </FormItem>
            <FormItem label="按钮名称" {...formItemLayout}>
                {
                    getFieldDecorator('Name',{
                        initialValue:sysButton.Name,
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
            <FormItem label="标识码" {...formItemLayout}>
                {
                    getFieldDecorator('Code',{
                        initialValue:sysButton.Code,
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
            <FormItem label="图标" {...formItemLayout}>
                {
                    getFieldDecorator('Icon',{
                        initialValue:sysButton.Icon,
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
                        initialValue:sysButton.Sort==null?1:sysButton.Sort,
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
            <FormItem label="描述" {...formItemLayout}>
                {
                    getFieldDecorator('Description',{
                        initialValue:sysButton.Description==null?null:sysButton.Description,
                    })(
                        <Input type="text" placeholder="请输入" maxLength={100}></Input>
                    )
                }
            </FormItem>
          </Form>
        );
    }
}

SysButtonForm=Form.create({})(SysButtonForm);