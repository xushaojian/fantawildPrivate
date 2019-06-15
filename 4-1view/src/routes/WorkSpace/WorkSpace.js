import React,{Component} from 'react';
import {Tabs} from 'antd';
import UserReport from './UserReport';
import UserProject from './UserProject';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {HashRouter as Router ,Route,Switch} from 'react-router-dom';
const TabPane = Tabs.TabPane;

export default class WorkSpace extends Component{
    constructor(props){
        super(props);
    }

    handleTabChange = key => {
        const { match ,history } = this.props;
        console.log(key);
        switch (key) {
          case 'userReport':
            history.push(`${match.url}/userReport`)
                break;
            case 'userProject':
            history.push(`${match.url}/userProject`)
                break;
            break;
          default:
            break;
        }
    };

    render(){
        const tabList=[
            {
                key:'userReport',
                tab:'我提交的报告'
            },
            {
                key:'userProject',
                tab:'我参与的项目'
            }
        ]
        const {match,children,location}=this.props;
        console.log('match:',match,'children:',children,'location:',location);
       return (
           <PageHeaderLayout 
                title="我的工作区"
                tabList={tabList}
                tabActiveKey={location.pathname.replace(`${match.path}/`,'')}
                onTabChange={this.handleTabChange}
           >
                <div >
                 <Router>
                     <Switch>
                       <Route path="/work/userReport" component={UserReport}></Route>
                       <Route path="/work/userProject" component={UserProject}></Route>
                     </Switch>
                    
                 </Router>
                </div>
         </PageHeaderLayout>
       );
    }
}