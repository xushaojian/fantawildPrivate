import React,{Component} from 'react';
import {Form,Select,Input,Checkbox,Button} from 'antd';
import './baseForm.less';

const FormItem=Form.Item;
const CheckboxGroup=Checkbox.Group;

class FilterForm extends React.Component{
    constructor(props){
        super(props);
    }
    getOptionList(data){
        if(!data){
            return [];
        }
        let options=[];
        data.map((item,i)=>{
            options.push(<Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>)
        });
        return options;
    }
    handleFilterSubmit=()=>{
        const form = this.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
      
          // 这里处理表单  values
          this.fieldsValue=this.props.form.getFieldsValue();
          this.props.filterSubmit(this.fieldsValue);
        });
    }
    handleCancel=()=>{
        this.props.form.resetFields();
    }
    initFormList=()=>{
        let formItemList=[];
        const {getFieldDecorator}=this.props.form;
        const formList=this.props.formList;
        //输入框样式
        const formItemLayout= this.props.formItemLayout;
        if(formList&&formList.length>0){
            formList.forEach((item)=>{
                let label=item.label;
                let field=item.field;
                let initValue=item.initialValue||'';
                let maxLength=item.maxLength||0;
                let placeholder=item.placeholder;
                let width=item.width;
                if(item.type=='INPUT'){
                    const INPUT =<FormItem label={label} {...formItemLayout} key={field}>
                                {
                                        getFieldDecorator([field],{
                                            initialValue:initValue,
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'参数不能为空'
                                                }
                                            ]
                                        })(
                                            <Input type="text" placeholder={placeholder} maxLength={maxLength}></Input>
                                        )
                                }
                                 </FormItem>;
                    formItemList.push(INPUT);
                }
                else if(item.type=='SELECT'){
                    const SELECT =<FormItem label={label} {...formItemLayout} key={field}>
                                {
                                        getFieldDecorator([field],{
                                            initialValue:initValue
                                        })(
                                            <Select style={{width:width}} placeholder={placeholder}>
                                                {this.getOptionList(item.list)}
                                            </Select>
                                        )
                                }
                                 </FormItem>;
                                 formItemList.push(SELECT);
                }
                else if(item.type=='CHECKBOX' ){
                    const CHECKBOX =<FormItem label={label} {...formItemLayout} key={field}>
                                {
                                        getFieldDecorator([field],{
                                            valuePropName:'checked',
                                            initialValue:initValue
                                        })(
                                            <Checkbox >
                                               {label}
                                            </Checkbox>
                                        )
                                }
                                 </FormItem>;
                            formItemList.push(CHECKBOX);
                }
                else if(item.type=='CHECKBOX_GROUP'){
                    const CHECKBOX_GROUP =<FormItem label={label} {...formItemLayout} key={field}>
                                    {
                                        getFieldDecorator([field])(
                                            <CheckboxGroup options={item.list}>
                                            </CheckboxGroup>
                                        )
                                    }
                                 </FormItem>;
                            formItemList.push(CHECKBOX_GROUP);
                }
            });
        }
        return formItemList;
    }

    render(){
        const iconName=this.props.iconName;
        const buttonName=this.props.buttonName;
        //button样式
        const buttonLayout=this.props.buttonLayout;
        return (
            <Form layout="horizontal">
                {this.initFormList()}
                <FormItem {...buttonLayout}>
                    <Button type="primary" style={{borderRadius:'14px'}}  icon={iconName}  onClick={this.handleFilterSubmit}>{buttonName}</Button>
                    <Button type="default" style={{marginLeft:'10px',borderRadius:'14px'}} icon="reload" onClick={this.handleCancel} >重置</Button>
                </FormItem>
            </Form>
        );
    }
}
 
const BaseForm = Form.create({})(FilterForm);
export default BaseForm;