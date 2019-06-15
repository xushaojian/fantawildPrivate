import React, { Component, Fragment } from 'react';
import { Form, Input, Upload, Select, Button,Modal ,Card} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Setting.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({sysUser,loading})=>({
    currentUser:sysUser.currentUser,
    loading:loading.models.sysUser
}))

@Form.create()
class Setting extends Component {
state={
    visible:true
}
  componentDidMount() {
      const {dispatch} =this.props;
      dispatch({
          type:'sysUser/fetchUser'
      })
    // this.setBaseInfo();
  }

//   setBaseInfo = () => {

//     const { currentUser, form } = this.props;
//     console.log(currentUser);
//     // Object.keys(form.getFieldsValue()).forEach(key => {
//     //   const obj = {};
//     //   obj[key] = currentUser[key] || null;
//     //   form.setFieldsValue(obj);
//     // });
//   };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

//提交数据
handleSubmit=()=>{
        const { dispatch  } = this.props;
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'sysUser/submitPassword',
                payload: { 
                     ...fieldsValue, 
                },
            });
        })
        //重置表单    
        this.props.form.resetFields();
}

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout={
        labelCol: {
            xs: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 8 },
          }
    }
    const buttonLayout={
        wrapperCol:{
            span:14,
            offset:10
        }
    }
    return (
    
      <PageHeaderLayout title="修改密码">
        <Card>
          <Form   hideRequiredMark>
                <FormItem label="原密码" {...formItemLayout}>
                    {getFieldDecorator('pwd', {
                                rules: [
                                {
                                    required: true,
                                    message:'密码不能为空'
                                },
                                ],
                            })(<Input type="password"/>)}
                </FormItem>
                <FormItem label="密码" {...formItemLayout}>
                    {getFieldDecorator('pwdNew', {
                                rules: [
                                {
                                    required: true,
                                    message:'密码不能为空'
                                },
                                ],
                            })(<Input type="password" placeholder="4位以上,包含大小写数字" minLength={4} maxLength={12}/>)}
                </FormItem>
                <FormItem {...buttonLayout}>
                    <Button type="primary" style={{borderRadius:'14px'}} onClick={this.handleSubmit}>保存</Button>
                </FormItem>
            </Form>
        </Card>
           
      </PageHeaderLayout>
    
    );
  }
}

export default Setting;
