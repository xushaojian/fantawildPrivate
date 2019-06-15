import React,{Component} from 'react';
import {Tabs} from 'antd';
import Project from './Project';
import ProjectType from './ProjectType';
import ProjectChildType from './ProjectChildType';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {HashRouter as Router ,Route,Switch} from 'react-router-dom';

export default class ProjectManage extends Component{
    constructor(props){
        super(props);
    }

    handleTabChange = key => {
        const { match ,history } = this.props;
        switch (key) {
          case 'info':
          history.push(`${match.url}/info`)
                break;
          default:
            break;
        }
    };

    render(){
        const tabList=[
            {
                key:'info',
                tab:'项目管理'
            }
        ]
        const {match,children,location}=this.props;
       return (
           <PageHeaderLayout 
                title="项目管理"
                tabList={tabList}
                tabActiveKey={location.pathname.replace(`${match.path}/`,'')}
                onTabChange={this.handleTabChange}
           >
                <div >
                 <Router>
                     <Switch>
                       <Route path="/base/project/info" component={Project}></Route>
                     </Switch>
                    
                 </Router>
                </div>
         </PageHeaderLayout>
       );
    }
}