import React from 'react';
import axios from 'axios';
import { connect } from 'dva';
import { Row,Col,Form,Icon,Input,Checkbox,message,Button,Tabs,Alert} from 'antd';
import CONFIG from '../../config';
import styles from './DingDing.less';

const FormItem = Form.Item;
//获取code,将code传入后台得到access_token获取用户信息
export const getUrlParam=(name,str)=>{
  var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
  var r=str.substr(1).match(reg);
  if(r!=null) return decodeURIComponent(r[2]);
  return null;
}

@connect(({ login, loading }) => ({
  login
}))

class DingDing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formVisable:false,
      openId:'',
      nickName:''
    };
  }

  componentDidMount(){
      this.fetchUserInfo();
  }
 
  //获取钉钉用户信息
  fetchUserInfo=()=>{
    const {location,history,dispatch}=this.props;
    var code=getUrlParam('code',location.search);
    if(code){
      axios({
          method:'get',
          url:CONFIG.GetDDUserInfo,
          params:{ code:code }
      }).then((response)=>{
        if(response.data.data.IsRegister!=undefined){
          const {UserId,IsRegister}=response.data.data;
          message.info(response.data.message);
          if(IsRegister==true&&UserId!=-1){
            dispatch({
              type: 'login/ddlogin',
              payload: {
                userId:UserId
              },
            });
          }else if(IsRegister==true&&UserId==-1){
            history.push({
              pathname: '/user/login' 
            })
          }else if(IsRegister==false&&UserId!=-1){
            this.setState({
              formVisable:true,
              openId:response.data.data.OpenId,
              nickName:response.data.data.NickName
            })
          }else{
            history.push({
              pathname: '/user/login' 
            })
          }
         
        }else{
          history.push({
            pathname: '/user/login' 
          })
        }
      
      }).catch((exception)=>{
        history.push({
          pathname: '/user/login' 
        })
      })
    }
  }

  //绑定提交  
  handleSubmit = e => {
      const {history,dispatch}=this.props;
      let _this=this;
      const {openId,nickName}=this.state;
      e.preventDefault();
      const { form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
         var data={
          openId:openId,
          nickName:nickName,
          ...fieldsValue
         };   
         axios({
            method:'get',
            url:CONFIG.BindDDUserInfo,
            params:data
        }).then((response)=>{
          if(response.data.data.UserId!=undefined){
            message.info(response.data.message);
            const {UserId}=response.data.data;
            if(UserId>0){
              dispatch({
                type: 'login/ddlogin',
                payload: {
                  userId:UserId
                },
              });
            }else{
              history.push({
                pathname: '/user/login' 
              })
            }
          }
        }).catch((exception)=>{
          history.push({
            pathname: '/user/login' 
          })
      });
    });
   }

    //账户密码绑定
    loadForm=()=>{
      const { form }=this.props;
      const { getFieldDecorator }=form;
  
      return (
              <Form 
                layout="horizontal"
                onSubmit={this.handleSubmit}
              > 
                <FormItem >
                {
                    getFieldDecorator('userName',{
                      initialValue:'',
                      rules:[
                          {
                              required:true,
                              message:'参数不能为空'
                          }
                        ]
                    })(
                        <Input type="text" placeholder="用户名" maxLength={20}></Input>
                      )
                  }
                  </FormItem>
                  <FormItem >
                  {
                    getFieldDecorator('password',{
                        initialValue:'',
                        rules:[
                                {
                                    required:true,
                                    message:'参数不能为空'
                                }
                              ]
                        })(
                          <Input type="password" placeholder="密码" />
                        )
                  }
                             
                  </FormItem>
                  <Row className={styles.formItem}>
                      <Button type="primary" htmlType="submit"   
                          className={styles.submitBtn}>
                          绑 定
                      </Button>
                  </Row>
              </Form>
        )
  }

  render() {
    return (
      <div className={styles.container}>
      <Row className={styles.row}>
        <Col lg={24}>
            <div className={styles.formWrapper}>
              <div className={styles.form}>
                    <h4 className={styles.title}>账户绑定</h4> 
                    {this.state.formVisable?this.loadForm():''}
                  {/* <h4 className={styles.title}>登陆</h4> */}
                  {/* <div className={styles.toggle}></div> */}
              </div>
            </div>
        </Col>
      </Row>
      </div>
    )
  }
}

export default Form.create()(DingDing);