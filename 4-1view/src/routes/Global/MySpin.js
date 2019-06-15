import React from 'react';
import {Spin} from 'antd';
import { connect } from 'dva';


class MySpin extends React.PureComponent{
    render(){
        return(
            <Spin size="large" spinning={this.props.spinLoading}>

            </Spin>
        );
    }
}