import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Drawer, Card, Row, Button, Tooltip, Icon, Divider, Form, Col, Input, Modal, message, List, Avatar } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from "components/StandardTable";
import RealVideo from './RealVideo';
import styles from './index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({ video, loading }) => ({
    allData: video.allData,
    loading: loading.models.video
}))
@Form.create()

export default class VideoList extends PureComponent {
    state = {
        type: '',
        videoId: 0,
        videoModalVisible: false,
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'video/fetch',
            payload: {
                currentPage: 1,
                pageSize: 10,
            }
        })
    }
    //行单击事件
    handleOnClickRow = (record, rowkey) => {

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
            type: 'video/fetch',
            payload: params,
        });
        this.setState({
            selectedRows: []
        })
    }

    //重置表单
    handleFormReset = () => {
        const { form, dispatch, allData: { pagination } } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'video/fetch',
            payload: {
                currentPage: pagination.current,
                pageSize: pagination.pageSize,
            },
        });
    };

    //搜索
    handleSearch = e => {
        e.preventDefault();
        const { dispatch, form, allData: { pagination } } = this.props;
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
                type: 'video/fetch',
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
                        <FormItem label="公园名称">
                            {getFieldDecorator('ParkName')(<Input placeholder="请输入" />)}
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


    handlePreview = (record) => {
        this.setState({
            videoId: record.Id,
            videoModalVisible: true
        })
    }


    //弹框操作
    handleOperate = (type, obj) => {
        const { dispatch, allData: { pagination } } = this.props;
        let options;
        switch (type) {
            case 'delete': {
                const deleteList = this.state.selectedRows.map(item => item.Id);
                var _this = this;
                if (deleteList.length < 1) {
                    Modal.info({
                        title: '提示',
                        content: '请选择一行'
                    })
                    return;
                } else {
                    confirm({
                        title: '删除视频信息?',
                        content: '确认删除视频信息？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk() {
                            dispatch({
                                type: 'video/submit',
                                payload: {
                                    id: deleteList.join(','),
                                    currentPage: pagination.current,
                                    pageSize: pagination.pageSize,
                                },
                            });
                            _this.setState({
                                selectedRows: []
                            });
                        },
                        onCancel() { },
                    });
                }
                break;
            }
            default:
                break;
        }
    }

    render() {
        const tablColumn = [
            {
                title: '序号',
                dataIndex: 'Id',
                key: 'Id',
                width: 90,
                sorter: (a, b) => a.Id - b.Id,
            },
            {
                title: '公园名称',
                dataIndex: 'ParkName',
                key: 'ParkName',

            },
            {
                title: '公园编码',
                dataIndex: 'ParkCode',
                key: 'ParkCode',
            },
            {
                title: '项目名称',
                dataIndex: 'ProjectName',
                key: 'ProjectName',

            },
            {
                title: '项目编码',
                dataIndex: 'ProjectCode',
                key: 'ProjectCode',
            },
            {
                title: '播放地址',
                dataIndex: 'PlayUrl',
                key: 'PlayUrl',
            },
            {
                title: '播放状态',
                dataIndex: 'Status',
                key: 'Status',
                render: (Status) => (
                    <span>
                        {Status === 'publish' ? '正在直播' : '直播结束'}
                    </span>
                )
            },
            {
                title: '操作',
                dataIndex: 'Operation',
                key: 'Operation',
                width: 80,
                render: (text, record) => (
                    <span>
                        <a onClick={() => {
                            this.handlePreview(record)
                        }}>预览</a>
                    </span>
                )
            }
        ]

        const {
            allData,
            loading,
        } = this.props;
        const formatData = { ...allData };
        const { selectedRows } = this.state;

        return (
            <PageHeaderLayout title="视频管理">
                <Modal title="视频预览"
                    visible={this.state.videoModalVisible}
                    onOk={() => {
                        this.setState({
                            videoModalVisible: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            videoModalVisible: false
                        })
                    }}
                    okText="确定"
                    cancelText="取消">
                    <RealVideo videoId={this.state.videoId} ref={player => this.videoPlayer = player} />
                </Modal>
                <Card>
                    <Row >
                        <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '20px 24px', minHeight: '800px', marginBottom: '20px' }}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <div style={{ margin: '10px 10px' }}>
                                <Button type="danger" style={{ marginLeft: '5px' }} icon="delete" onClick={() => { this.handleOperate('delete') }} >删除</Button>
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
            </PageHeaderLayout>
        );
    }
}

