import React,{Component} from 'react';
import {Tree,Icon} from 'antd';
const TreeNode = Tree.TreeNode;
export default class TreeCheck extends React.Component {
    state = {
        expandedKeys: ["/"],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: []
    }
    // componentDidMount(){
       
    //     console.log('RoleMenuButtonList',menuButtonList);
    //     this.setState({
    //         checkedKeys:menuButtonList
    //     })
    // }
    //选中的回调
    onSelect = (selectedKeys, info) => {
        console.log('info', info);
        this.setState({ selectedKeys,checkedKeys:selectedKeys });
    }

    onCheck = (checkedKeys,info) => {
        const { onTreeSelect } = this.props;
        if (onTreeSelect) {
            onTreeSelect(checkedKeys,info);
        }
        // this.setState({ checkedKeys });
    }

    //展开的回调
    onExpend = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
          });
    }
 
    //遍历json绘制出tree结构
    mapData = (children) => {
        if (children && Array.isArray(children)) {
            return children.map((ele) => {
                if (ele.children && Array.isArray(ele.children)) {
                    return <TreeNode icon={<Icon type="folder" />} title={ele.Name} key={ele.Id+':'+ele.Name}>
                        {this.mapData(ele.children)}
                    </TreeNode>
                } else {
                    return <TreeNode icon={<Icon type="folder"/>} title={ele.Name} key={ele.Id+':'+ele.Name}/>
                }
            })
        }
        return []
    }
 
    render() {
        let content = []
        let {treeData,roleMenuButtonData} = this.props;
        // let menuButtonList=[];
        console.log( 'TreeCheck-treeData:',treeData);
        console.log( 'TreeCheck-roleMenuButtonData:',roleMenuButtonData);
        treeData.map((ele)=>{
            content.push(<TreeNode title={ele.Name} key={ele.Name} >{this.mapData(ele.children)}</TreeNode>)
            return content;
        })
        
        return (
            <Tree
                checkable
                onExpand={this.onExpend}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={roleMenuButtonData}
              >
                {content}
            </Tree>
        )
    }
}