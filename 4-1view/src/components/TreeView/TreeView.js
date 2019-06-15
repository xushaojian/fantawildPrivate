import React,{Component} from 'react';
import {Tree,Icon} from 'antd';

const TreeNode = Tree.TreeNode;

export default class TreeView extends React.Component {
    state = {
        expandedKeys:this.props.treeData.map(item=>item.Id),
        autoExpandParent: true,
        selectedKeys: []
    }

    //选中的回调
    onSelect = (selectedKeys, info) => {
         const {onTreeSelect}=this.props;
         onTreeSelect(selectedKeys);
        this.setState({ selectedKeys });
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
                    return <TreeNode icon={<Icon type="folder" />} title={ele.Name+'('+ele.MemberNum+'人)'} key={ele.Id}>
                        {this.mapData(ele.children)}
                    </TreeNode>
                } else {
                    return <TreeNode icon={<Icon type="folder"/>} title={ele.Name+'('+ele.MemberNum+'人)'} key={ele.Id}/>
                }
            })
        }
        return []
    }
 
    render() {
        let content = []
        let {treeData} = this.props;
        console.log(treeData);
        treeData.map((ele)=>{
            content.push(<TreeNode  title={ele.Name+'('+ele.MemberNum+'人)'} key={ele.Id} >{this.mapData(ele.children)}</TreeNode>)
            return content;
        })
    
        return (
            <Tree
                showIcon
                onExpand={this.onExpend}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}>
                {content}
            </Tree>
        )
    }
}