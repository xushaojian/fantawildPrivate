import React,{Component} from 'react';
import {Tabs ,Table,Card,Modal, Button, Row,Col,Input,message,Divider, Icon ,Tooltip,Tag} from 'antd';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import FileSaver from 'file-saver';
import CONFIG from '../../config';
import { getCurrentUser} from '../../utils/currentUser';
import styles from './Index.less';

const Search=Input.Search;
const confirm = Modal.confirm;


export default class UserReport extends Component{
    constructor(props){
        super(props);
        var self=this;
        this.tableColumns = [];  //初始定义表头菜单
        this.state={
            data: [],
            pagination: { 
                current:1,
                total: 0, //数据总数量
                pageSize: 10,  //显示几条一页
                defaultPageSize: 10, //默认显示几条一页
                showSizeChanger: true,  //是否显示可以设置几条一页的选项
                onShowSizeChange(current, pageSize) { 
                    self.fetch({
                            results:pageSize,
                            page:current
                        })
                },                                      
                onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                    self.fetch({
                        results:self.state.pagination.pageSize,
                        page:current
                    })
                },
                showTotal:function(){
                    return (
                        <span>
                            共 <span style={{color:'#1890ff',fontWeight: 700}}>{self.state.pagination.total} </span> 条
                        </span>
                    )
                }
            },
            loading: false,
            selected:[],
            visible:false,
            reportId:'',
            tags: [],
            inputVisible: false,
            inputValue: '',
        }
    }
    
    getFileNameNoExt(name){
        var pos=name.lastIndexOf(".");
        return name.substring(0,pos);
    }

    componentDidMount() {
        this.fetch();
    }

    getTable() {    //函数封装
        let self = this;
        this.tableColumns =[
            {
                title:'编号',
                dataIndex:'Id',
                key:'Id',
                width: 80,
                sorter:(a,b)=>a.Id-b.Id,
            },
            {
                title:'名称',
                dataIndex:'FileName',
                key:'FileName',
                className:styles.resultColumns,
                render:(fileName)=>(
                    <div title={fileName} className={styles.resultFileNameDiv}>
                        <a  href={CONFIG.ReportPreviewUrl+self.getFileNameNoExt(fileName)+'.pdf'} target="_blank"><span>{fileName}</span></a>
                     </div>
                )
            },  {
                title:'公园',
                dataIndex:'ParkName',
                sorter:(a,b)=>a.ParkName.length-b.ParkName.length,
                key:'ParkName'
            }
            ,
            {
                title:'项目',
                dataIndex:'ProjectName',
                sorter:(a,b)=>a.ProjectName.length-b.ProjectName.length,
                key:'ProjectName'
            }
            ,{
                title:'设备',
                dataIndex:'Device',
                key:'Device'
            } ,
            {
                title:'故障日期',
                dataIndex:'FaultDate',
                key:'FaultDate',
                width: 120,
                sorter:(a,b)=>a.FaultDate-b.FaultDate,
                render:(time)=>(
                    <span>
                        {self.changeDateFormat(time)}
                    </span>
                )
            }
            ,
            {
                title:'部门',
                dataIndex:'DepartmentName',
                key:'DepartmentName'
            }
            ,
            {
                title:'提交人',
                dataIndex:'UploadUserName',
                key:'UploadUserName',
                width: 120,
            },
            {
                title:'报告日期',
                dataIndex:'ReportDate',
                key:'ReportDate',
                width: 120,
                sorter:(a,b)=>a.ReportDate-b.ReportDate,
                render:(time)=>(
                    <span>
                        {self.changeDateFormat(time)}
                    </span>
                )
            } ,
            {
                title:'类型',
                dataIndex:'ReportTypeName',
                key:'ReportTypeName',
            },
            {
                title:'版本号',
                dataIndex:'Version',
                key:'Version'
            }
            ,
            {
                title:'操作',
                dataIndex:'Operation',
                key:'Operation',
                width: 80,
                render:(text,record)=>(
                    <span>
                        <Tooltip title="下载" placement="top">
                            <a onClick={()=>{
                                self.downloadReport(record.Id)
                            }}> <Icon type="download"></Icon>
                            </a>
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="标签" placement="top">
                            <a onClick={()=>{
                                self.addMark(record.Id)
                            }}><Icon type="tags"></Icon></a>
                        </Tooltip>
                       
                    </span>
                )
            }
        ]
    }

    changeDateFormat(time){
        var changeDate = new Date(time);
        return (
            changeDate.getFullYear() + '-' + (changeDate.getMonth() + 1) + '-' + changeDate.getDate()
        );
    }

    //表格查询
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
    }

    fetch = (params = {}) => {
            const { history } = this.props;
            let current_user=JSON.parse(getCurrentUser());
            if(current_user==null){
                history.push(`/user/login`);
                return;
            }
            let data= {
                results:this.state.pagination.pageSize,
                page:this.state.pagination.current,
                uploadUser:current_user.RealName,
                ...params
            };
            
            this.setState({ loading: true });
            axios({
                method:'get',
                url: CONFIG.GetReportList,
                params:data
            }).then((response)=>{
                console.log(response);
                const pagination = { ...this.state.pagination };
                pagination.total = response.data.totalCount;
                pagination.pageSize=data.results;
                pagination.current=data.page;
                this.setState({
                    loading: false,
                    data:  response.data.data.map((item,index)=>{
                        item.key=index;
                        return item;
                    }),
                    pagination,
                    selected:[]
                });
            }).catch(function (error) {
                console.log(error);
            });
      }

      //行内下载
      downloadReport(text){
        axios({
            method:'get',
            url: CONFIG.FileDownload+'?id='+text+'&type=report',
            responseType:'blob'
        }).then((response)=>{
                let fileName=decodeURI(response['headers']['content-disposition'].split('filename=')[1]);
                const blob=new Blob([response.data]);
                FileSaver.saveAs(blob,fileName);
        }).catch(function (error) {
            console.log(error);
        });
      }

      //下载保存
      onSaveReport(){
           //文档下载file-saver插件 后台保存Blob 
           let selectlist=[...this.state.selected];
           if(selectlist.length<1){
            Modal.info({
                title:'提示',
                content:'请选择一行'
            })
               return;
           }
           selectlist.map((value,key)=>{
                axios({
                    method:'get',
                    url: CONFIG.FileDownload+'?id='+value.Id+'&type=report',
                    responseType:'blob'
                }).then((response)=>{
                        let fileName=decodeURI(response['headers']['content-disposition'].split('filename=')[1]);
                        const blob=new Blob([response.data]);
                        FileSaver.saveAs(blob,fileName);
                }).catch(function (error) {
                    console.log(error);
                });
           })
    }

    //文档删除
    deleteReport(){
        let self=this;
        const { history } = this.props;
        let current_user=JSON.parse(getCurrentUser());
        if(current_user==null){
            history.push(`/user/login`);
            return;
        }
         let selectlist=[...this.state.selected];
         if(selectlist.length<1){
            Modal.info({
                title:'提示',
                content:'请选择一行'
            })
            return;
        }
        confirm({
            title: '删除报告?',
            content: '确认删除所选报告？',
            onOk() {
                let selectKey=[];
                selectlist.map((value,key)=>{
                    selectKey.push(value.Id);
                })
                axios({
                        method:'get',
                        url: CONFIG.DeleteReports+'?ids='+selectKey.join(',')+'&userName='+current_user.RealName,
                    }).then((response)=>{
                        if(response.data.errno==0){
                            message.success('报告删除成功!');
                            self.fetch();
                        }else{
                            message.error(response.data.error);
                            self.fetch();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            onCancel() {},
          });
    }

     //加载标签
     loadTags=(id)=>{
        let params={
            reportId:id
        };
        axios({
            method:'get',
            url: CONFIG.GetReportTagList,
            params:params
        }).then((response)=>{
            console.log(response);
            this.setState({
                tags: response.data.data.tagList.map((item,key)=>{
                   return item.TagName;
                })
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    //添加标签
    addMark(id){
        //加载tags
        this.loadTags(id);
        this.setState({
            visible:true,
            reportId:id
        })
    }

    //删除标签
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        //请求删除数据
        let tagStr=tags.join(',');
        axios({
            method:'get',
            url: CONFIG.DeleteTagList,
            params:{
                reportId:this.state.reportId,
                tagArray:tagStr
            }
        }).then((response)=>{
            
        }).catch(function (error) {
            console.log(error);
        });
        this.setState({ tags });
      }
    
      showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
      }
    
      handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
      }

      //新增标签
      handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        console.log(tags);
          //请求新增数据
        let tagStr=tags.join(',');
        axios({
            method:'get',
            url: CONFIG.AddTagList,
            params:{
               reportId:this.state.reportId,
               tagArray:tagStr
            }
        }).then((response)=>{
            console.log(response);
           
        }).catch(function (error) {
            console.log(error);
        });
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
          });
    }

    //modal提交
    onModalOk=()=>{
       
        this.setState({
            visible:false
        })
    }

    //modal取消
    onModalCancel=()=>{
        this.setState({
            visible:false
        })
    }

    saveInputRef = input => this.input = input

    render(){
        const { tags, inputVisible, inputValue } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selected:selectedRows
                });
            },
            getCheckboxProps: record => ({
                disabled: record.Name === 'Name', // Column configuration not to be checked
                name: record.Name,
            }),
        };
        this.getTable();
        var self=this;
       return (
           
        <div >
               <Modal
                title="设置标签"
                visible={this.state.visible}
                onOk={this.onModalOk}
                onCancel={this.onModalCancel}
                okText="确定"
                cancelText="取消"
                >
                     {
                         tags.map((tag, index) => {
                            const isLongTag = tag.length > 20;
                            const tagElem = (
                                <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                        })
                    }
                    {
                        inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                        )
                    }
                    {
                        !inputVisible && (
                            <Tag
                                onClick={this.showInput}
                                style={{ background: '#fff', borderStyle: 'dashed' }}
                            >
                            <Icon type="plus" />标签
                            </Tag>
                        )
                    }
                </Modal>
            <Row style={{backgroundColor:'#fff',padding:'5px 4px',minHeight:'800px',marginBottom:'20px'}}>
            {
                this.state.data.length>0?<div style={{margin:'20px 15px'}}>
                <Button type="primary" style={{borderRadius:'14px'}} icon="download" onClick={()=>{this.onSaveReport()}} >下载保存</Button>
                <Button type="danger" style={{marginLeft:'5px',borderRadius:'14px'}} icon="delete" onClick={()=>{this.deleteReport()}} >删除报告</Button>
                </div>:null
            }
                <Table rowSelection={rowSelection} dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    columns={this.tableColumns}
                    style={{marginTop:'20px'}}
                >
                </Table>
            </Row>
        </div>
       );
    }
}